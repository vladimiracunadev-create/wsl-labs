; ─────────────────────────────────────────────────────────────────────────────
; WSL Labs — Inno Setup Installer Script
; Version: 0.1.0
;
; Requisitos en la maquina de build:
;   - Inno Setup 6.x  (https://jrsoftware.org/isinfo.php)
;   - wsl-labs-launcher.exe compilado en launcher\windows\
;   - Ejecutar desde la raiz del repo (o via scripts\windows\build-installer.ps1)
;
; Salida:
;   dist\wsl-labs-setup-{version}.exe
;
; Distribucion:
;   Subir el instalador generado a GitHub Releases como release asset.
;   NO commitear el binario del instalador al repositorio.
;
; Nota sobre firma de codigo:
;   Este instalador NO esta firmado digitalmente en v0.x/v1.x.
; ─────────────────────────────────────────────────────────────────────────────

#define AppName     "WSL Labs"
; AppVersion puede sobreescribirse desde CLI: ISCC /DAppVersion=1.2.0
; El guard #ifndef asegura que el CLI tenga prioridad sobre este valor.
; Sin el guard, el #define del script sobreescribe el /D del CLI (bug ISPP).
#ifndef AppVersion
  #define AppVersion "0.1.0"
#endif
#define AppPublisher "Vladimir Acuna Dev"
#define AppURL      "https://github.com/vladimiracunadev-create/wsl-labs"
#define AppExeName  "wsl-labs-launcher.exe"
#define InstallDir  "{localappdata}\WSLLabs"

[Setup]
AppId={{9F4A3B2C-5D8E-4F0A-B1C2-3D4E5F6A7B8C}
AppName={#AppName}
AppVersion={#AppVersion}
AppPublisher={#AppPublisher}
AppPublisherURL={#AppURL}
AppSupportURL={#AppURL}/issues
AppUpdatesURL={#AppURL}/releases
DefaultDirName={#InstallDir}
DefaultGroupName={#AppName}
AllowNoIcons=yes
OutputDir=..\dist
OutputBaseFilename=wsl-labs-setup-{#AppVersion}
Compression=lzma2/ultra64
SolidCompression=yes
WizardStyle=modern
; No requiere admin — instala en la carpeta del usuario.
PrivilegesRequired=lowest
; No signing en v0.x/v1.x
; SignTool=...
ArchitecturesInstallIn64BitMode=x64compatible
UninstallDisplayName={#AppName}
UninstallDisplayIcon={app}\{#AppExeName}
MinVersion=10.0

[Languages]
Name: "english"; MessagesFile: "compiler:Default.isl"
Name: "spanish"; MessagesFile: "compiler:Languages\Spanish.isl"

[Tasks]
Name: "desktopicon"; Description: "{cm:CreateDesktopIcon}"; GroupDescription: "{cm:AdditionalIcons}"; Flags: unchecked

[Files]
; Launcher ejecutable (compilado aparte — ver scripts/windows/build-launcher.ps1)
Source: "..\launcher\windows\wsl-labs-launcher.exe"; DestDir: "{app}"; Flags: ignoreversion

; Config raiz y documentacion
Source: "..\labs.config.json"; DestDir: "{app}"; Flags: ignoreversion
Source: "..\README.md";        DestDir: "{app}"; Flags: ignoreversion
Source: "..\LICENSE";          DestDir: "{app}"; Flags: ignoreversion

; Casos de contenedores (Dockerfiles + catalogo para wslc build/up)
Source: "..\containers\*"; DestDir: "{app}\containers"; \
  Flags: ignoreversion recursesubdirs createallsubdirs

; Assets estaticos del dashboard (servidos por el Control Center en 9092)
Source: "..\index.html";    DestDir: "{app}"; Flags: ignoreversion
Source: "..\dashboard.css"; DestDir: "{app}"; Flags: ignoreversion
Source: "..\dashboard.js";  DestDir: "{app}"; Flags: ignoreversion

; Control Center (backend Node.js que corre en Windows)
Source: "..\dashboard-server\*"; DestDir: "{app}\dashboard-server"; \
  Flags: ignoreversion recursesubdirs createallsubdirs; \
  Excludes: "node_modules\*"

; Contenido de los labs (fuente + guias, sin node_modules)
Source: "..\labs\*"; DestDir: "{app}\labs"; \
  Flags: ignoreversion recursesubdirs createallsubdirs; \
  Excludes: "node_modules\*,__pycache__\*,*.pyc"

; Scripts de aprovisionamiento dentro de WSL2
Source: "..\scripts\*"; DestDir: "{app}\scripts"; \
  Flags: ignoreversion recursesubdirs createallsubdirs

[Icons]
; Menu Inicio
Name: "{group}\{#AppName} — Control Center"; \
  Filename: "{app}\{#AppExeName}"; \
  WorkingDir: "{app}"; \
  Comment: "Iniciar el Control Center de WSL Labs"

Name: "{group}\{#AppName} — Uninstall"; \
  Filename: "{uninstallexe}"

; Escritorio (opcional, desmarcado por defecto)
Name: "{autodesktop}\{#AppName}"; \
  Filename: "{app}\{#AppExeName}"; \
  WorkingDir: "{app}"; \
  Tasks: desktopicon

[Run]
; Ofrecer lanzar tras la instalacion
Filename: "{app}\{#AppExeName}"; \
  Description: "{cm:LaunchProgram,{#StringChange(AppName, '&', '&&')}}"; \
  Flags: nowait postinstall skipifsilent

[Code]
// Mostrar aviso de binario sin firma antes de instalar
function InitializeSetup(): Boolean;
var
  Msg: String;
begin
  Msg :=
    'WSL Labs v{#AppVersion}' + #13#10 + #13#10 +
    'AVISO — Binario sin firma' + #13#10 +
    '─────────────────────────────────────────' + #13#10 +
    'Este instalador no esta firmado digitalmente en v0.x/v1.x.' + #13#10 +
    'Windows SmartScreen puede mostrar una advertencia.' + #13#10 + #13#10 +
    'Esta es la version oficial desde GitHub Releases:' + #13#10 +
    '{#AppURL}/releases' + #13#10 + #13#10 +
    'Selecciona "Mas informacion" -> "Ejecutar de todas formas" si aparece.' + #13#10 +
    'La firma de codigo esta planificada para una version futura.' + #13#10 + #13#10 +
    'Requisitos: WSL2 instalado y Node.js LTS en el PATH.' + #13#10 + #13#10 +
    'Continuar con la instalacion?';
  Result := MsgBox(Msg, mbConfirmation, MB_YESNO) = IDYES;
end;
