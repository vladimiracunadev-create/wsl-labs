// WSL Labs Launcher — punto de entrada para Windows
//
// Flujo:
//   1. Verifica que wsl.exe exista y que haya al menos una distro instalada.
//   2. Localiza la raiz del repo (directorio del ejecutable o WSL_LABS_HOME).
//   3. Arranca el Control Center: `node dashboard-server/server.js` en background,
//      con la raiz del repo como directorio de trabajo. El servidor corre en
//      Windows (puerto 9092) y controla los servicios dentro de WSL2.
//   4. Hace polling a http://localhost:9092/api/overview hasta 90s.
//   5. Abre el browser en http://localhost:9092.
//
// Build:
//   go build -ldflags "-X main.launcherVersion=1.2.0" -o wsl-labs-launcher.exe .
//
// Solo usa la biblioteca estandar de Go (sin dependencias externas).
package main

import (
	"fmt"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"
	"runtime"
	"strings"
	"time"
)

// launcherVersion se inyecta en compilacion con:
//   -ldflags "-X main.launcherVersion=X.Y.Z"
var launcherVersion = "0.1.0"

const (
	controlPort    = 9092
	healthURL      = "http://localhost:9092/api/overview"
	dashboardURL   = "http://localhost:9092"
	startupTimeout = 90 * time.Second
	pollInterval   = 3 * time.Second
)

func main() {
	printBanner()

	// 1 — Verificar WSL2 y que haya una distro instalada
	step("1/4", "Verificando WSL2...")
	if err := checkWSLAvailable(); err != nil {
		failWith("wsl.exe no encontrado en el PATH.", []string{
			"Instala WSL2 con: wsl --install",
			"Reinicia Windows y vuelve a ejecutar este launcher.",
			"Guia oficial: https://learn.microsoft.com/windows/wsl/install",
		})
	}
	ok("wsl.exe disponible")

	distro, err := detectDistro()
	if err != nil {
		failWith("No se encontro ninguna distribucion de WSL instalada.", []string{
			"Instala una distro con: wsl --install -d Ubuntu",
			"Verifica las distros instaladas con: wsl -l -q",
		})
	}
	ok("Distro detectada: " + distro)
	fmt.Println()

	// 2 — Localizar la raiz del repo
	step("2/4", "Localizando la raiz del repositorio...")
	repoRoot, err := findRepoRoot()
	if err != nil {
		failWith("No se pudo localizar la raiz de WSL Labs.", []string{
			"Ejecuta el launcher desde la carpeta de instalacion.",
			"O define la variable de entorno WSL_LABS_HOME apuntando a la raiz del repo.",
			"Ruta esperada: <install_dir>\\wsl-labs-launcher.exe",
		})
	}
	ok("Raiz del repo: " + repoRoot)
	fmt.Println()

	// 3 — Arrancar el Control Center (node dashboard-server/server.js)
	step("3/4", "Arrancando el Control Center (puerto 9092)...")
	if err := checkNodeAvailable(); err != nil {
		failWith("Node.js no encontrado en el PATH.", []string{
			"Instala Node.js LTS desde https://nodejs.org/",
			"Reinicia la terminal y vuelve a ejecutar este launcher.",
		})
	}
	ok("Node.js disponible")

	if err := startControlCenter(repoRoot); err != nil {
		failWith("No se pudo arrancar el Control Center.", []string{
			"Verifica que dashboard-server/server.js exista en la raiz del repo.",
			"Comando equivalente (desde la raiz del repo):",
			"  node dashboard-server\\server.js",
		})
	}
	ok("Control Center iniciandose en segundo plano")
	fmt.Println()

	// 4 — Esperar a que el Control Center responda
	step("4/4", "Esperando que el Control Center este listo...")
	fmt.Print("    ")
	ready := waitForReady(healthURL, startupTimeout)
	fmt.Println()
	if ready {
		ok("Control Center listo")
	} else {
		warn("El Control Center aun no responde. Recarga el browser si no carga.")
	}
	fmt.Println()

	// 5 — Abrir el browser
	info("Abriendo " + dashboardURL)
	openBrowser(dashboardURL)
	fmt.Println()

	// Resumen final
	printLine()
	fmt.Println("  WSL Labs esta corriendo.")
	fmt.Println()
	fmt.Println("  El browser se abrio en el Control Center.")
	fmt.Println("  Desde ahi puedes:")
	fmt.Println("    - Ver el estado de cada servicio dentro de WSL2 en tiempo real")
	fmt.Println("    - Iniciar, reiniciar o detener servicios Linux con un clic")
	fmt.Println("    - Ver logs de cada lab")
	fmt.Println()
	fmt.Printf("    %-24s http://localhost:%d\n", "Control Center", controlPort)
	fmt.Println()
	fmt.Println("  Puedes cerrar esta ventana; el Control Center seguira corriendo.")
	printLine()
	fmt.Println()

	if isDoubleClicked() {
		fmt.Println("  Presiona ENTER para cerrar...")
		fmt.Scanln()
	}
}

// checkWSLAvailable verifica que wsl.exe este en el PATH.
func checkWSLAvailable() error {
	return exec.Command("wsl.exe", "--status").Run()
}

// detectDistro ejecuta `wsl.exe -l -q` y devuelve la primera distro encontrada.
// La salida de wsl.exe en Windows suele venir en UTF-16, por lo que limpiamos
// bytes nulos antes de parsear.
func detectDistro() (string, error) {
	out, err := exec.Command("wsl.exe", "-l", "-q").Output()
	if err != nil {
		return "", err
	}
	// Eliminar bytes nulos (UTF-16 -> ASCII) y espacios de control.
	cleaned := strings.ReplaceAll(string(out), "\x00", "")
	cleaned = strings.ReplaceAll(cleaned, "\r", "\n")
	for _, line := range strings.Split(cleaned, "\n") {
		name := strings.TrimSpace(line)
		if name != "" {
			return name, nil
		}
	}
	return "", fmt.Errorf("no hay distribuciones de WSL instaladas")
}

// checkNodeAvailable verifica que node este en el PATH.
func checkNodeAvailable() error {
	return exec.Command("node", "--version").Run()
}

// findRepoRoot localiza la raiz del repo. Orden de busqueda:
//  1. Variable de entorno WSL_LABS_HOME.
//  2. Directorio del ejecutable.
//  3. Directorio de trabajo actual.
//
// Se considera valida una ruta que contenga dashboard-server/.
func findRepoRoot() (string, error) {
	// 1 — WSL_LABS_HOME
	if home := os.Getenv("WSL_LABS_HOME"); home != "" {
		if hasDashboardServer(home) {
			return home, nil
		}
	}

	// 2 — Directorio del ejecutable
	if exe, err := os.Executable(); err == nil {
		dir := filepath.Dir(exe)
		if hasDashboardServer(dir) {
			return dir, nil
		}
	}

	// 3 — Directorio de trabajo actual
	if cwd, err := os.Getwd(); err == nil {
		if hasDashboardServer(cwd) {
			return cwd, nil
		}
	}

	return "", fmt.Errorf("dashboard-server/ no encontrado (define WSL_LABS_HOME)")
}

// hasDashboardServer indica si dir contiene la carpeta dashboard-server.
func hasDashboardServer(dir string) bool {
	_, err := os.Stat(filepath.Join(dir, "dashboard-server"))
	return err == nil
}

// startControlCenter arranca `node dashboard-server/server.js` en background,
// usando repoRoot como directorio de trabajo. No espera a que termine.
func startControlCenter(repoRoot string) error {
	serverJS := filepath.Join("dashboard-server", "server.js")
	cmd := exec.Command("node", serverJS)
	cmd.Dir = repoRoot
	cmd.Env = os.Environ()
	// Silenciar la salida del servidor para no ensuciar la consola del launcher.
	cmd.Stdout, cmd.Stderr = nil, nil
	// Start (no Run) para dejarlo corriendo en segundo plano.
	return cmd.Start()
}

// waitForReady hace polling al endpoint de salud hasta timeout.
func waitForReady(url string, timeout time.Duration) bool {
	deadline := time.Now().Add(timeout)
	for time.Now().Before(deadline) {
		resp, err := http.Get(url) //nolint:gosec
		if err == nil && resp.StatusCode == 200 {
			resp.Body.Close()
			return true
		}
		if resp != nil {
			resp.Body.Close()
		}
		fmt.Print(".")
		time.Sleep(pollInterval)
	}
	return false
}

// openBrowser abre la URL en el navegador por defecto.
// En Windows usa rundll32 (mas fiable que `start` cuando no hay shell).
func openBrowser(url string) {
	var cmd *exec.Cmd
	switch runtime.GOOS {
	case "windows":
		cmd = exec.Command("rundll32", "url.dll,FileProtocolHandler", url)
	case "darwin":
		cmd = exec.Command("open", url)
	default:
		cmd = exec.Command("xdg-open", url)
	}
	if err := cmd.Start(); err != nil {
		// Fallback: cmd /c start
		if runtime.GOOS == "windows" {
			_ = exec.Command("cmd", "/c", "start", "", url).Start()
		}
	}
}

func printBanner() {
	fmt.Println()
	printLine()
	fmt.Println("  WSL Labs  v" + launcherVersion)
	fmt.Println("  Control Center para servicios Linux sobre WSL2 en localhost")
	printLine()
	fmt.Println()
	fmt.Println("  AVISO: Este launcher no esta firmado digitalmente (v0.x/v1.x).")
	fmt.Println("  Si Windows muestra advertencia, selecciona")
	fmt.Println("  'Mas informacion' > 'Ejecutar de todas formas'.")
	printLine()
	fmt.Println()
}

func printLine()       { fmt.Println("  " + strings.Repeat("-", 58)) }
func step(n, m string) { fmt.Printf("  [%s] %s\n", n, m) }
func ok(m string)      { fmt.Printf("    [OK] %s\n", m) }
func warn(m string)    { fmt.Printf("    [!]  %s\n", m) }
func info(m string)    { fmt.Printf("    [>]  %s\n", m) }

// failWith imprime un error con sugerencias y termina con exit code 1.
func failWith(reason string, hints []string) {
	fmt.Println()
	fmt.Println("  ERROR: " + reason)
	if len(hints) > 0 {
		fmt.Println()
		fmt.Println("  Como resolver:")
		for _, h := range hints {
			fmt.Println("    " + h)
		}
	}
	fmt.Println()
	if isDoubleClicked() {
		fmt.Println("  Presiona ENTER para cerrar...")
		fmt.Scanln()
	}
	os.Exit(1)
}

// isDoubleClicked detecta si el .exe fue lanzado por doble clic (sin consola
// interactiva), para pausar antes de cerrar la ventana.
func isDoubleClicked() bool {
	if runtime.GOOS != "windows" {
		return false
	}
	fi, err := os.Stdout.Stat()
	if err != nil {
		return false
	}
	return (fi.Mode() & os.ModeCharDevice) == 0
}
