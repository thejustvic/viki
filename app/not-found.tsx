'use client'

import {Button} from '@/components/daisyui/button'
import {motion} from 'framer-motion'
import Link from 'next/link'

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <motion.h1
        className="text-6xl font-bold"
        initial={{opacity: 0, y: -20}}
        animate={{opacity: 1, y: 0}}
        transition={{duration: 0.5}}
      >
        404
      </motion.h1>
      <motion.p
        className="mt-4 text-xl text-gray-600"
        initial={{opacity: 0}}
        animate={{opacity: 1}}
        transition={{delay: 0.3}}
      >
        Oops! The page you are looking for does not exist.
      </motion.p>
      <motion.div
        className="mt-6"
        initial={{opacity: 0}}
        animate={{opacity: 1}}
        transition={{delay: 0.6}}
      >
        <Button soft color="info">
          <Link href="/cards">Go Home</Link>
        </Button>
      </motion.div>
    </div>
  )
}
