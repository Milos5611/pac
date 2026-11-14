@echo off
rem Deploys the application into a local Kubernetes cluster (Minikube by default).
rem   install.bat          plan, ask for confirmation, apply
rem   install.bat --yes    plan and apply without asking
rem Target cluster: TF_VAR_kube_context (default "minikube") in
rem TF_VAR_kube_config_path (default %USERPROFILE%\.kube\config). Refuses to run
rem if that context does not exist.
setlocal
cd /d "%~dp0"

if "%TF_VAR_kube_context%"=="" (set "KUBE_CONTEXT=minikube") else (set "KUBE_CONTEXT=%TF_VAR_kube_context%")
if "%TF_VAR_kube_config_path%"=="" (set "KUBE_CONFIG_PATH=%USERPROFILE%\.kube\config") else (set "KUBE_CONFIG_PATH=%TF_VAR_kube_config_path%")

kubectl --kubeconfig "%KUBE_CONFIG_PATH%" config get-contexts "%KUBE_CONTEXT%" >nul 2>&1
if errorlevel 1 (
  echo Error: kube context '%KUBE_CONTEXT%' not found in %KUBE_CONFIG_PATH%. 1>&2
  echo Start Minikube first ^(minikube start^) or set TF_VAR_kube_context. 1>&2
  exit /b 1
)

echo Target kube context: %KUBE_CONTEXT% (%KUBE_CONFIG_PATH%)

terraform init || exit /b 1
terraform validate || exit /b 1
terraform plan -out planfile -var "kube_context=%KUBE_CONTEXT%" -var "kube_config_path=%KUBE_CONFIG_PATH%" || exit /b 1

if /i not "%~1"=="--yes" (
  set /p "ANSWER=Apply this plan to context '%KUBE_CONTEXT%'? [y/N] "
)
if /i not "%~1"=="--yes" (
  call :confirm || (del planfile & echo Aborted. & exit /b 1)
)

terraform apply planfile
set "RESULT=%ERRORLEVEL%"
del planfile
exit /b %RESULT%

:confirm
if /i "%ANSWER%"=="y" exit /b 0
exit /b 1
