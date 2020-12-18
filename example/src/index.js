import './index.css'

import React from 'react'
import ReactDOM from 'react-dom'
import TestViewer from 'react-jest-test-viewer'
import App from './App'

ReactDOM.render(
  <TestViewer
    active={process.env.NODE_ENV === 'development'}
    showTests={true}
    testFile='test.html'
  >
    <App />
  </TestViewer>,
  document.getElementById('root')
)
