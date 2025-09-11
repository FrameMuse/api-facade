import BodyTypeConverter from "./BodyTypeConverter"
import { BodyType, BodyTypeMap } from "./types"

class BodyTypeUtils {
  static async convertType<T, CT extends BodyType>(value: T, contentType: CT): Promise<BodyTypeMap[CT]> {
    const converter = new BodyTypeConverter(value)
    return converter.convert(contentType)
  }

  static resolve(body: Body, type?: BodyType): Promise<unknown> {
    try {
      switch (type) {
        case "json": return body.json()
        case "formData": return body.formData()
        case "text": return body.text()
        case "blob": return body.blob()
        case "arrayBuffer": return body.arrayBuffer()

        default:
          return body.json()
      }
    } catch (error) {
      return Promise.reject(error)
    }
  }

  /**
   * Serializes `body` if its `contentType` is `json`.
   */
  static toBodyInit(value: unknown): BodyInit {
    if (value instanceof ArrayBuffer) return value
    if (value instanceof Blob) return value
    if (value instanceof FormData) return value

    return JSON.stringify(value)
  }

  /**
   * [MIME_types](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types)
   */
  static fromMediaType(mediaType: string): BodyType {
    if (mediaType.includes("json")) return "json"
    if (mediaType.includes("form-data")) return "formData"

    if (mediaType.includes("text")) return "text"
    if (mediaType.includes("urlencoded")) return "text"

    throw new TypeError("`mediaType` could not be resolved.", { cause: { mediaType } })
  }
}

export default BodyTypeUtils
