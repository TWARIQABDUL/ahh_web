import { Layout } from 'antd'
import React from 'react'
import { Outlet } from 'react-router-dom'
// import Header from '../components/Header'
import AppHeader from '../components/Header'
import Footer from '../components/footer'

const LayoutPage:React.FC = ()=> {
  return (
    <Layout>
        <Layout.Content>
            <AppHeader/>
            {/* <Hero/> */}
            <Outlet/>
        </Layout.Content>
        <Footer/>
    </Layout>
  )
}

export default LayoutPage