import React from 'react'

const Notification = ({ systemStatus }) => {
  if (systemStatus === null) {
    return null
  }

  if (systemStatus.error) {
    return <div className='error'>{systemStatus.error}</div>
  } else if (systemStatus.success) {
    return <div className='success'>{systemStatus.success}</div>
  }
}

export default Notification
