# Hooks de Gyro

## useContractBalance

Este hook permite obtener el balance de un usuario desde el smart contract de Gyro.

### Uso

```tsx
import { useContractBalance } from '@/hooks/useContractBalance';

function MyComponent() {
  const { balance, loading, error, refreshBalance } = useContractBalance({
    userAddress: "GABC123...", // Dirección Stellar del usuario
    assetType: "USDC" // "USDC" o "Bs"
  });

  return (
    <div>
      {loading ? (
        <p>Cargando balance...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <p>Balance: {balance} USDC</p>
      )}
      <button onClick={refreshBalance}>Actualizar</button>
    </div>
  );
}
```

### Parámetros

- `userAddress` (string, opcional): Dirección Stellar del usuario
- `assetType` ("USDC" | "Bs", opcional): Tipo de activo. Por defecto "USDC"

### Retorno

- `balance` (number): Balance actual del usuario
- `loading` (boolean): Estado de carga
- `error` (string | null): Error si ocurre alguno
- `refreshBalance` (function): Función para refrescar el balance

---

## useDeposit

Este hook permite realizar depósitos reales en el smart contract de Gyro.

### Uso

```tsx
import { useDeposit } from '@/hooks/useDeposit';

function MyComponent() {
  const { deposit, loading, error, success, reset, isRegistered } = useDeposit({
    userAddress: "GABC123..." // Dirección Stellar del usuario
  });

  const handleDeposit = async () => {
    await deposit({
      amount: 100.50,
      reference: "Depósito desde app",
      assetType: "USDC"
    });
  };

  return (
    <div>
      <button onClick={handleDeposit} disabled={loading}>
        {loading ? 'Procesando...' : 'Realizar Depósito'}
      </button>
      {error && <p>Error: {error}</p>}
      {success && <p>¡Depósito exitoso!</p>}
    </div>
  );
}
```

### Parámetros

- `userAddress` (string, opcional): Dirección Stellar del usuario

### Retorno

- `deposit` (function): Función para realizar depósitos
- `loading` (boolean): Estado de carga
- `error` (string | null): Error si ocurre alguno
- `success` (boolean): Indica si el depósito fue exitoso
- `reset` (function): Función para resetear el estado
- `isRegistered` (boolean | null): Estado de registro del usuario

### Parámetros de deposit()

- `amount` (number): Cantidad a depositar
- `reference` (string, opcional): Referencia del depósito
- `assetType` ("USDC" | "Bs", opcional): Tipo de activo. Por defecto "USDC"

---

## useUserRegistration

Este hook permite registrar usuarios y verificar su estado de registro en el smart contract.

### Uso

```tsx
import { useUserRegistration } from '@/hooks/useUserRegistration';

function MyComponent() {
  const { registerUser, checkRegistration, isRegistered, registrationLoading } = useUserRegistration({
    userAddress: "GABC123..."
  });

  const handleRegister = async () => {
    await registerUser();
  };

  return (
    <div>
      <button onClick={handleRegister} disabled={registrationLoading}>
        {registrationLoading ? 'Registrando...' : 'Registrar Usuario'}
      </button>
      <p>Estado: {isRegistered ? 'Registrado' : 'No registrado'}</p>
    </div>
  );
}
```

### Parámetros

- `userAddress` (string, opcional): Dirección Stellar del usuario

### Retorno

- `registerUser` (function): Función para registrar al usuario
- `checkRegistration` (function): Función para verificar el estado de registro
- `isRegistered` (boolean | null): Estado de registro del usuario
- `registrationLoading` (boolean): Estado de carga del registro

---

## useUserRegistration

Este hook permite registrar y verificar usuarios en el smart contract de usuario.

### Uso

```tsx
import { useUserRegistration } from '@/hooks/useUserRegistration';

function MyComponent() {
  const { 
    registerUser, 
    checkRegistration, 
    loading, 
    error, 
    success, 
    isRegistered 
  } = useUserRegistration({
    userAddress: "GABC123..." // Dirección Stellar del usuario
  });

  return (
    <div>
      <p>Usuario registrado: {isRegistered ? 'Sí' : 'No'}</p>
      <button onClick={registerUser} disabled={loading}>
        Registrar Usuario
      </button>
      <button onClick={checkRegistration} disabled={loading}>
        Verificar Registro
      </button>
    </div>
  );
}
```

### Parámetros

- `userAddress` (string, opcional): Dirección Stellar del usuario

### Retorno

- `registerUser` (function): Función para registrar usuario
- `checkRegistration` (function): Función para verificar registro
- `loading` (boolean): Estado de carga
- `error` (string | null): Error si ocurre alguno
- `success` (boolean): Indica si la operación fue exitosa
- `isRegistered` (boolean | null): Estado de registro del usuario
- `reset` (function): Función para resetear el estado

---

## useWithdraw

Este hook permite realizar retiros reales desde el smart contract de Gyro.

### Uso

```tsx
import { useWithdraw } from '@/hooks/useWithdraw';

function MyComponent() {
  const { withdraw, loading, error } = useWithdraw({
    userAddress: "GABC123...", // Dirección Stellar del usuario
    onWithdrawSuccess: () => {
      console.log('Retiro exitoso');
    }
  });

  const handleWithdraw = async () => {
    await withdraw(100.50); // Monto en BOB
  };

  return (
    <div>
      <button onClick={handleWithdraw} disabled={loading}>
        {loading ? 'Procesando...' : 'Realizar Retiro'}
      </button>
      {error && <p>Error: {error}</p>}
    </div>
  );
}
```

### Parámetros

- `userAddress` (string): Dirección Stellar del usuario
- `onWithdrawSuccess` (function, opcional): Callback ejecutado al completar el retiro

### Retorno

- `withdraw` (function): Función para realizar retiros
- `loading` (boolean): Estado de carga
- `error` (string | null): Error si ocurre alguno

### Parámetros de withdraw()

- `bobAmount` (number): Cantidad a retirar en BOB (se convierte automáticamente a USDC)

---

## useTransactionHistory

Este hook permite obtener el historial de transacciones del usuario desde el smart contract.

### Uso

```tsx
import { useTransactionHistory } from '@/hooks/useTransactionHistory';

function MyComponent() {
  const { transactions, loading, error, refreshHistory } = useTransactionHistory({
    userAddress: "GABC123...", // Dirección Stellar del usuario
    refreshKey: 1 // Key para forzar refresco
  });

  return (
    <div>
      {loading ? (
        <p>Cargando historial...</p>
      ) : (
        <div>
          {transactions.map(tx => (
            <div key={tx.id}>
              {tx.type}: {tx.amount} {tx.asset}
            </div>
          ))}
        </div>
      )}
      <button onClick={refreshHistory}>Actualizar</button>
    </div>
  );
}
```

### Parámetros

- `userAddress` (string): Dirección Stellar del usuario
- `refreshKey` (number, opcional): Key para forzar refresco del historial

### Retorno

- `transactions` (Transaction[]): Lista de transacciones
- `loading` (boolean): Estado de carga
- `error` (string | null): Error si ocurre alguno
- `refreshHistory` (function): Función para refrescar el historial

### Interface Transaction

```tsx
interface Transaction {
  id: string;
  type: 'deposit' | 'withdraw';
  amount: number;
  asset: string;
  date: string;
  status: 'pending' | 'completed' | 'failed';
}
```

---

## Notas Importantes

### Configuración de Redes

Todos los hooks se conectan automáticamente al testnet de Stellar:

- **Gyro Contract**: `networks.testnet.contractId` (CAOSVKNJ54XTRNLPBS5HBSY2YVIAZYPM2CBQOMLVXOSL7GA6DFRT3AJY)
- **User Contract**: `networks.testnet.contractId` (CANM3T4BWINEPXWFWDIUT7XFX44TGS6AFJMXPNGKFSW6J7UL2422M263)

### Flujo de Depósito

1. **Verificación de registro**: El hook `useDeposit` verifica automáticamente si el usuario está registrado
2. **Registro automático**: Si no está registrado, lo registra automáticamente
3. **Ejecución del depósito**: Realiza el depósito en el smart contract
4. **Actualización de balance**: El balance se actualiza automáticamente

### Manejo de Errores

- Todos los hooks incluyen manejo de errores robusto
- Los errores se muestran en la consola con emojis para fácil identificación
- Los estados de error se pueden resetear usando la función `reset()`

 