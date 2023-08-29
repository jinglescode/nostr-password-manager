import type { PlasmoMessaging } from "@plasmohq/messaging"

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  // const message = await querySomeApi(req.body.id)

  console.log("ping", req)
  res.send({
    message: "ok"
  })
}

export default handler
