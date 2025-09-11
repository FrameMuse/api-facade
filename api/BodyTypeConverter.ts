import { isRecord } from "@/utils/common"

import { BodyType, BodyTypeMap } from "./types"

class BodyTypeConverter {
  constructor(private data: unknown) { }
  async convert<CT extends BodyType>(contentType: CT): Promise<BodyTypeMap[CT]> {
    switch (contentType) {
      case "json":
        return this.toJson() as never
      case "formData":
        return this.toFormData() as never
      case "text":
        return this.toText() as never
      case "blob":
        return this.toBlob() as never
      case "arrayBuffer":
        return await this.toArrayBuffer() as never

      default:
        throw new TypeError(`Unknown content type: ${contentType}.`)
    }
  }

  toJson(): unknown {
    if (this.data == null) {
      return null
    }

    if (typeof this.data === "string") {
      return JSON.parse(this.data)
    }

    // if (this.data instanceof ArrayBuffer) {
    //   return JSON.parse(new TextDecoder().decode(this.data))
    // }
    // if (this.data instanceof Blob) {
    //   return JSON.parse(new TextDecoder().decode(this.data))
    // }
    if (this.data instanceof FormData) {
      const object: Record<string, unknown> = {}
      this.data.forEach((value, key) => {
        object[key] = value as unknown
      })
      return object
    }

    if (this.data instanceof Array) return this.data
    if (isRecord(this.data)) return this.data

    throw new Error("Cannot convert to JSON.")
  }
  toFormData(): FormData {
    function toStringOrBlob(value: unknown): string | Blob {
      if (value instanceof Blob) return value

      return JSON.stringify(value)
    }

    if (this.data == null) {
      return new FormData()
    }

    // if (typeof this.data === "string") {
    //   return new FormData()
    // }
    // if (this.data instanceof ArrayBuffer) {
    //   return new FormData()
    // }
    // if (this.data instanceof Blob) {
    //   return new FormData()
    // }
    if (this.data instanceof FormData) {
      return this.data
    }


    if (this.data instanceof Array) {
      const formData = new FormData()
      this.data.forEach((value, index) => {
        formData.append(String(index), toStringOrBlob(value))
      })
      return formData
    }

    if (isRecord(this.data)) {
      const formData = new FormData()
      for (const key in this.data) {
        formData.append(key, toStringOrBlob(this.data[key]))
      }
      return formData
    }

    throw new Error("Cannot convert to form data.")
  }
  toText(): string {
    if (this.data == null) {
      return ""
    }

    if (typeof this.data === "string") {
      return this.data
    }

    return String(this.data)
  }
  toBlob(): Blob {
    if (this.data == null) {
      return new Blob()
    }

    if (typeof this.data === "string") {
      return new Blob([this.data])
    }

    if (this.data instanceof ArrayBuffer) {
      return new Blob([this.data])
    }

    if (this.data instanceof Blob) {
      return this.data
    }

    throw new Error("Cannot convert to blob.")
  }
  async toArrayBuffer(): Promise<ArrayBuffer> {
    if (this.data == null) {
      return new ArrayBuffer(0)
    }

    if (typeof this.data === "string") {
      return new TextEncoder().encode(this.data).buffer
    }

    if (this.data instanceof ArrayBuffer) {
      return this.data
    }

    if (this.data instanceof Blob) {
      return await this.data.arrayBuffer()
    }

    throw new Error("Cannot convert to array buffer.")
  }
}

export default BodyTypeConverter
