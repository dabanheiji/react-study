/** @jsxRuntime classic */
/** @jsx react.jsx */
import react, { useState } from "./packages/react";
import ReactDOM from './packages/react-dom'

const App = () => {
    const [count, setCount] = useState(0);
    window.setCount = setCount;

    return (
        <div>
            <p>{count}</p>
        </div>
    )
}

ReactDOM.createRoot(document.querySelector('#root')).render(<App />);
