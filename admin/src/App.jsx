import Login from '@/pages/Login';
import { useContext } from 'react';
import { AdminContext } from './context/AdminContext';

function App() {
    const { aToken } = useContext(AdminContext);

    return aToken ? (
        <div>
            <h2>đã đang nhập admin</h2>
        </div>
    ) : (
        <div>
            <Login></Login>
        </div>
    );
}

export default App;
