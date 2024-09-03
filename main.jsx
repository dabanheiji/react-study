/** @jsxRuntime classic */
/** @jsx react.jsx */
import react from "./packages/react";
import ReactDOM from './packages/react-dom'

const List = () => {
    return (
        <ul>
            <li>1</li>
            <li>2</li>
            <li>3</li>
        </ul>
    )
}

const App = () => {
    return (
        <div>
            <p>list</p>
            <List />
        </div>
    )
}

ReactDOM.createRoot(document.querySelector('#root')).render(<App />);
