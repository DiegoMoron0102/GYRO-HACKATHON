<div align="center">
  <img src="./public/images/gyro-logo.png" alt="GYRO Wallet Logo" width="200"/>
  <h1 align="center">GYRO Wallet</h1>
  <p align="center">
    Una billetera digital segura y moderna construida sobre la red Stellar con Soroban Smart Contracts.
    <br />
    <a href="#"><strong>Explorar la demo »</strong></a>
    <br />
    <br />
    <a href="https://github.com/your-username/GYRO-HACKATHON/issues">Reportar Bug</a>
    ·
    <a href="https://github.com/your-username/GYRO-HACKATHON/issues">Solicitar Feature</a>
  </p>
</div>

## Sobre el Proyecto

GYRO Wallet es una aplicación de billetera digital desarrollada para el **GYRO-HACKATHON**. Proporciona una experiencia de usuario fluida y fácil de entender para la gestión de activos digitales, con un fuerte enfoque en la seguridad y la simplicidad. La aplicación utiliza el poder de los smart contracts de Soroban en la red de pruebas de Stellar para manejar la lógica de negocio on-chain.

## ✨ Características

-   **Autenticación Segura:** Inicio de sesión rápido y seguro basado en PIN.
-   **Registro de Usuario On-Chain:** Creación de cuentas de usuario directamente en la blockchain de Stellar.
-   **Gestión de Saldo en Tiempo Real:** Visualización de saldos de USDC consultados desde el smart contract.
-   **Flujos de Transacciones:** Procesos completos para depósitos y retiros.
-   **Funcionalidad QR:** Escaneo y generación de códigos QR para facilitar pagos y depósitos.
-   **Verificación KYC Integrada:** Un flujo simulado de "Conoce a tu Cliente" para cumplir con las regulaciones.
-   **Diseño Mobile-First:** Interfaz de usuario responsiva y optimizada para dispositivos móviles.

## 🛠️ Tech Stack

-   **Frontend:** Next.js, React, TypeScript, Tailwind CSS
-   **Blockchain:** Stellar, Soroban Smart Contracts
-   **Lenguaje de Contratos:** Rust
-   **Gestión de Estado:** React Hooks (`useState`, `useEffect`, `useCallback`)
-   **Librerías Clave:** `@stellar/stellar-sdk`, `@soroban-react/core`

## 📂 Estructura del Proyecto

```
GYRO-HACKATHON/
├── backend/
│   └── contracts/
│       ├── gyro/         # Smart contract para la gestión de saldos
│       └── user/         # Smart contract para el registro de usuarios
├── packages/
│   ├── gyro/             # Bindings TS para el contrato gyro
│   └── user/             # Bindings TS para el contrato user
├── public/
│   └── images/
└── src/
    ├── app/              # Páginas y componentes principales de Next.js
    ├── hooks/            # Hooks personalizados para la lógica de negocio
    └── utils/            # Funciones de utilidad
```

## 🚀 Getting Started

Sigue estos pasos para configurar y ejecutar el proyecto en tu entorno local.

### Prerrequisitos

Asegúrate de tener instalado lo siguiente:
-   [Node.js](https://nodejs.org/) (v18 o superior)
-   [Rust](https://www.rust-lang.org/tools/install)
-   [Soroban CLI](https://soroban.stellar.org/docs/getting-started/setup#install-the-soroban-cli)

### Instalación

1.  **Clona el repositorio:**
    ```bash
    git clone https://github.com/your-username/GYRO-HACKATHON.git
    cd GYRO-HACKATHON
    ```

2.  **Instala las dependencias del frontend:**
    ```bash
    npm install
    ```

3.  **Construye los Smart Contracts:**
    Navega a cada directorio de contrato y compila los archivos WASM.
    ```bash
    # Construye el contrato de usuario
    cd backend/contracts/user
    stellar contract build

    # Construye el contrato de saldo (gyro)
    cd ../gyro
    stellar contract build
    ```

4.  **Despliega los Smart Contracts:**
    Despliega ambos contratos en la red de pruebas (Testnet) de Stellar. Guarda los IDs de contrato que se generan.
    ```bash
    # Despliega el contrato de usuario
    stellar contract deploy --wasm backend/contracts/user/target/wasm32-unknown-unknown/release/user.wasm

    # Despliega el contrato de saldo
    stellar contract deploy --wasm backend/contracts/gyro/target/wasm32-unknown-unknown/release/gyro.wasm
    ```

5.  **Actualiza los IDs de Contrato:**
    Reemplaza los IDs de contrato existentes en los siguientes archivos con los que obtuviste en el paso anterior:
    -   `src/hooks/useRegisterUser.ts`
    -   `src/hooks/useUserBalance.ts`
    -   `packages/user/README.md`
    -   `packages/gyro/README.md`

6.  **Regenera los Bindings de Contratos:**
    Actualiza las librerías de cliente en el directorio `packages/` para que coincidan con tus contratos desplegados.
    ```bash
    # Regenera los bindings para el contrato de usuario
    soroban contract bindings ts --contract-id YOUR_NEW_USER_CONTRACT_ID --output-dir ./packages/user --name user

    # Regenera los bindings para el contrato de saldo
    soroban contract bindings ts --contract-id YOUR_NEW_GYRO_CONTRACT_ID --output-dir ./packages/gyro --name gyro
    ```
    Después de regenerar, compila los paquetes:
    ```bash
    npm run build --workspace=@packages/user
    npm run build --workspace=@packages/gyro
    ```

7.  **Ejecuta el servidor de desarrollo:**
    ```bash
    npm run dev
    ```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver la aplicación en funcionamiento.

## 💡 Uso

1.  **Crear una cuenta:** Usa el botón "Crear Nueva Cuenta" en la pantalla de inicio de sesión.
2.  **Iniciar sesión:** Ingresa el PIN de 4 dígitos que creaste durante el registro.
3.  **Dashboard:** Una vez autenticado, verás tu saldo y las opciones para depositar, retirar y ver tu historial de transacciones.
4.  **KYC:** La primera vez que intentes depositar o retirar, se te pedirá que completes un proceso de verificación de identidad simulado.
