@echo off
echo 🚀 Iniciando Sistema de Biblioteca - Backend com Docker
echo.

REM Verificar se Docker está rodando
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker não está instalado ou não está rodando
    echo Por favor, instale o Docker Desktop e tente novamente
    pause
    exit /b 1
)

echo ✅ Docker detectado
echo.

REM Parar containers existentes
echo 🛑 Parando containers existentes...
docker-compose down >nul 2>&1

REM Construir e iniciar containers
echo 🏗️ Construindo e iniciando containers...
docker-compose up -d --build

if %errorlevel% neq 0 (
    echo ❌ Erro ao iniciar containers
    echo Verifique os logs com: docker-compose logs
    pause
    exit /b 1
)

echo.
echo ✅ Containers iniciados com sucesso!
echo.

REM Aguardar PostgreSQL estar pronto
echo ⏳ Aguardando PostgreSQL estar pronto...
timeout /t 10 /nobreak >nul

REM Executar migração e seed
echo 🗄️ Configurando banco de dados...
docker-compose exec app npm run migrate
docker-compose exec app npm run seed

echo.
echo 🎉 Sistema de Biblioteca iniciado com sucesso!
echo.
echo 📋 Serviços disponíveis:
echo    🔗 Backend API: http://localhost:3000
echo    📖 Health Check: http://localhost:3000/api/health
echo    🐘 PostgreSQL: localhost:5432
echo.
echo 📚 Dados de teste criados:
echo    👤 Admin: pedro.oliveira@email.com / 123456
echo    📚 Bibliotecário: joao.silva@email.com / 123456
echo    👥 Leitores: maria.santos@email.com / 123456
echo.
echo 🔧 Comandos úteis:
echo    Ver logs: docker-compose logs -f
echo    Parar: docker-compose down
echo    Reiniciar: docker-compose restart
echo.
echo Pressione qualquer tecla para ver os logs em tempo real...
pause >nul

REM Mostrar logs
docker-compose logs -f
