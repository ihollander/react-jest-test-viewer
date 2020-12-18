import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import TestViewer from '..'

describe('TestViewer', () => {
  it('only displays when active', () => {
    render(
      <TestViewer active={false}>
        <h1>Hello</h1>
      </TestViewer>
    )
    expect(screen.queryByText(/Tests/)).not.toBeInTheDocument()

    render(
      <TestViewer active>
        <h1>Hello</h1>
      </TestViewer>
    )
    expect(screen.queryByText(/Tests/)).toBeInTheDocument()
  })

  // more tests pls
})
