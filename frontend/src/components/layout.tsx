import React from 'react'

import './layout.css'

const Layout = ({ children }) => (
  <>
    <div>
      <main>{children}</main>
    </div>
  </>
)

export default Layout
