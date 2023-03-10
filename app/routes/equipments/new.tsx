import type { ActionFunction } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { useActionData, Form } from '@remix-run/react'
import { db } from '~/utils/db.server'
import { Button, Container, Stack, Typography } from '@mui/material'
import EquipmentForm from '~/components/EquipmentForm'
import type { EquipmentFields } from '~/schemas/equipmentSchema'
import { equipmentSchema } from '~/schemas/equipmentSchema'

type ActionData = {
  formError?: string
  fields?: Partial<EquipmentFields>
}

export let action: ActionFunction = async ({ request }): Promise<Response | ActionData> => {
  let fields = Object.fromEntries(await request.formData())
  let results = equipmentSchema.safeParse(fields)

  if (!results.success) {
    return { formError: results.error.message, fields }
  }

  let equipment = await db.equipment.create({ data: results.data })
  return redirect(`/equipments/${equipment.id}`)
}

export default function NewEquipmentRoute() {
  let actionData = useActionData<ActionData | undefined>()

  return (
    <Container maxWidth="lg">
      <Typography variant="h2" gutterBottom>
        Créer un équipement
      </Typography>
      <Form method="post">
        <Stack direction="column" spacing={2}>
          <EquipmentForm {...actionData?.fields} />
          {actionData?.formError && <Typography color="error">{actionData.formError}</Typography>}
          <Button variant="contained" type="submit">
            Create
          </Button>
        </Stack>
      </Form>
    </Container>
  )
}
