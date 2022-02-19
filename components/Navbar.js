import Link from 'next/link'
import React, { useState, useEffect } from 'react'

export default function Navbar({navs, className}) {
  const [navlst, setNavlst] = useState([])
  const [classname, setClassname] = useState("")

  useEffect(() => {
    setNavlst(navs)
  }, [navs])

  useEffect(() => {
    setClassname(className)
  }, [className])

  return (
    <nav className={classname}>
      <ul>
        { navlst.map((navEle, idx) => {
          return (
            <li key={classname + idx.toString()}>
              <Link href={navEle.href}>
                <a>
                  {navEle.data}
                </a>
              </Link>
            </li>
          )
        }) }
      </ul>
    </nav>
  )
}