import React from 'react'
import ReactDOM from 'react-dom/client'

import {WorkView} from "./WorkView";

const appEl = document.querySelector('#app');
if (appEl) {
    const root = ReactDOM.createRoot(appEl);
    root.render(
        <React.StrictMode>
            <WorkView/>
        </React.StrictMode>
    )
}
