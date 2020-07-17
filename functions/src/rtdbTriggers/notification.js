const countNotifications = (change, context) => {
  const data = change.after.val()
  const path = context.params
  console.log({ data, path })
}

module.exports = { countNotifications }
