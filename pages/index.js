import React from 'react'
import styled from 'styled-components'
import Link from 'next/link'
import Layout from '../components/Layout'

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`

const Image = styled.img`
  height: 400px;
  border-radius: 10px;
  cursor: pointer;
`

const MainPage = () => (
  <Layout>
    <Container>
      <Link href="/contract">
        <Image src="/static/DEXON.gif" />
      </Link>
    </Container>
  </Layout>
)

export default MainPage
