/** @jsxRuntime classic */
/** @jsx react.jsx */
import react from "./packages/react";
import ReactDOM from './packages/react-dom'

const jsx = (
    <div>
        <p>list</p>
        <ul>
            <li>1</li>
            <li>2</li>
            <li>3</li>
        </ul>
    </div>
)

ReactDOM.createRoot(document.querySelector('#root')).render(jsx);
