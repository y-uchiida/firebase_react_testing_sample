import React from 'react'
import { Messages } from './Messages'
import { MessageForm } from './MessagesForm'

export const App = () => {
	return (
		<div>
			<h1>Sample Chat App</h1>
			<div>
				<Messages />
				<MessageForm />
			</div>
		</div>
	)
}
