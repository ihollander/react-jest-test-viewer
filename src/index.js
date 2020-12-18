import React, { useLayoutEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { useLocalStorage } from '@rehooks/local-storage'

const TestPanel = styled.div`
  z-index: 10000;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 500px;
  border-left: 1px solid #5572ac;
  background-color: #fff;
`

const Resizer = styled.div`
  z-index: 10000;
  position: absolute;
  top: 0;
  bottom: 0;
  width: 10px;
  cursor: col-resize;
`

const TestIFrame = styled.iframe`
  width: 100%;
  height: 100%;
  border: none;
`

const ToggleButton = styled.button`
  z-index: 10000;
  position: fixed;
  top: 10px;
  right: 20px;
  background-color: rgb(63, 78, 96);
  border-radius: 0.3em;
  border: none;
  color: #fff;
  font-weight: bold;
  padding: 0.5em;
  cursor: pointer;
`

function TestViewer({ testFile = 'test.html', showTests = false, children }) {
  const [isOpen, setIsOpen] = useLocalStorage('__test_panel_is_open', showTests)
  const [containerWidth, setContainerWidth] = useLocalStorage(
    '__test_panel_width',
    500
  )
  const [isResizing, setIsResizing] = useState(false)
  const panelRef = useRef()

  useLayoutEffect(() => {
    if (containerWidth < 100) {
      setIsOpen(false)
    } else if (isOpen) {
      panelRef.current.style.width = `${containerWidth}px`
    }
  }, [containerWidth, isOpen, setIsOpen])

  useLayoutEffect(() => {
    if (isResizing) {
      const run = (e) => {
        if (!panelRef.current) return
        e.preventDefault()
        const containerWidth = window.innerWidth - e.pageX
        setContainerWidth(containerWidth)
      }

      document.addEventListener('mousemove', run)
      document.addEventListener('mouseup', handleResizeEnd)
      document.addEventListener('dragend', handleResizeEnd)
      document.addEventListener('touchend', handleResizeEnd)

      return () => {
        document.removeEventListener('mousemove', run)
        document.removeEventListener('mouseup', handleResizeEnd)
        document.removeEventListener('dragend', handleResizeEnd)
        document.removeEventListener('touchend', handleResizeEnd)
      }
    }
  }, [isResizing, setContainerWidth])

  function handleResizeEnd() {
    setIsResizing(false)
  }

  function handleResizeStart() {
    setIsResizing(true)
  }

  return (
    <React.Fragment>
      {children}
      <aside className='TestViewer'>
        {isOpen ? (
          <TestPanel ref={panelRef}>
            <Resizer
              onMouseDown={handleResizeStart}
              onMouseUp={handleResizeEnd}
              onDragEnd={handleResizeEnd}
            />
            <ToggleButton onClick={() => setIsOpen(false)}>
              Hide Tests
            </ToggleButton>
            <TestIFrame src={testFile} title='Jest Tests' />;
          </TestPanel>
        ) : (
          <ToggleButton onClick={() => setIsOpen(true)}>
            Show Tests
          </ToggleButton>
        )}
      </aside>
    </React.Fragment>
  )
}

function TestViewerWrapper({ active = true, children, ...rest }) {
  if (!active) return children

  return <TestViewer {...rest}>{children}</TestViewer>
}

export default TestViewerWrapper
