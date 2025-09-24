import { Layout } from 'antd'
import React from 'react'
import { Outlet } from 'react-router-dom'
// import Header from '../components/Header'
import AppHeader from '../components/Header'
import Hero from '../components/Hero'

function LayoutPage() {
  return (
    <Layout>
        <Layout.Content>
            <AppHeader/>
            {/* <Hero/> */}
            <Outlet/>
        </Layout.Content>
        <Layout.Footer>
            <div>Footer Content</div>
        </Layout.Footer>
    </Layout>
  )
}

export default LayoutPage