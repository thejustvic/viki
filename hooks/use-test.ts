import {ArrUtil} from '@/utils/arr-util'
import {useEffect} from 'react'

interface User {
  id: number
  userName: string
}

interface Message {
  id: number
  text: string
  userId: number
}

interface UserMessage extends Message {
  userName: string
}

export const useTest = (): void => {
  useEffect(() => {
    // // Input
    // const messages = [{id: 1, text: 'hello', userId: 1}]
    // const users = [{id: 1, userName: 'viktor'}]

    // // Output
    // const messagesWithUsername = [
    //   {id: 1, text: 'hello', userId: 1, userName: 'Viktor'}
    // ]

    const usersCount = 1_000
    const messagesCount = 1_000

    benchmarkMergeNaive(usersCount, messagesCount)
    benchmarkMergeOptimized(usersCount, messagesCount)
  }, [])
}

const generateUsers = (count: number): User[] => {
  const users = []

  for (let i = 0; i < count; i++) {
    users.push({
      id: i,
      userName: `User ${i}`
    })
  }

  return users
}

const generateMessages = (count: number, users: User[]): Message[] => {
  const messages = []

  for (let i = 0; i < count; i++) {
    messages.push({
      id: i,
      text: `Some text ${i}`,
      userId: users[i].id
    })
  }

  return messages
}

const mergeMessagesNaive = (
  messages: Message[],
  users: User[]
): UserMessage[] => {
  const userMessages: UserMessage[] = []

  for (const message of messages) {
    const userName = users.find(user => user.id === message.userId)?.userName
    if (userName) {
      const userMessage: UserMessage = {...message, userName}
      userMessages.push(userMessage)
    }
  }

  return userMessages
}

const mergeMessagesOptimized = (
  messages: Message[],
  users: User[]
): UserMessage[] => {
  const userMessages: UserMessage[] = []

  console.time('ArrUtil.fastGroupBy')
  const usersByIds = ArrUtil.fastGroupBy(users, 'id')
  console.timeEnd('ArrUtil.fastGroupBy')

  for (const message of messages) {
    const userName = usersByIds[message.userId]?.userName
    if (userName) {
      const userMessage: UserMessage = {...message, userName}
      userMessages.push(userMessage)
    }
  }

  return userMessages
}

const benchmarkMergeNaive = (
  usersCount: number,
  messagesCount: number
): void => {
  const users = generateUsers(usersCount)
  const messages = generateMessages(messagesCount, users)

  console.time('mergeMessagesNaive')
  mergeMessagesNaive(messages, users)
  console.timeEnd('mergeMessagesNaive')
}

const benchmarkMergeOptimized = (
  usersCount: number,
  messagesCount: number
): void => {
  const users = generateUsers(usersCount)
  const messages = generateMessages(messagesCount, users)

  console.time('mergeMessagesOptimized')
  mergeMessagesOptimized(messages, users)
  console.timeEnd('mergeMessagesOptimized')
}
