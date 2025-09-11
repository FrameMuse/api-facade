import UnreachableCodeError from "@/shared/errors/UnreachableCodeError"

import { RequestMethod } from "./types"


export function getMethodForm(method: RequestMethod, form: "active" | "neutral" | "completed") {
  switch (form) {
    case "active": return getActiveForm().toLowerCase()
    case "neutral": return getNeutralForm().toLowerCase()
    case "completed": return getCompletedForm().toLowerCase()

    default:
      throw new UnreachableCodeError
  }

  function getActiveForm() {
    switch (method) {
      case "GET": return "Retrieving"
      case "POST": return "Processing"
      case "PATCH": return "Updating"
      case "PUT": return "Uploading"
      case "DELETE": return "Deleting"

      default: return "[Unknown summary]"
    }
  }
  function getNeutralForm() {
    switch (method) {
      case "GET": return "Retrieve"
      case "POST": return "Creation"
      case "PATCH": return "Update"
      case "PUT": return "Upload"
      case "DELETE": return "Deletion"

      default: return "[Unknown summary]"
    }
  }
  function getCompletedForm() {
    switch (method) {
      case "GET": return "Retrieved"
      case "POST": return "Created"
      case "PATCH": return "Updated"
      case "PUT": return "Uploaded"
      case "DELETE": return "Deleted"

      default: return "[Unknown summary]"
    }
  }
}
