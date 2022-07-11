import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import MessagesCustom from '../messagesCustom'

export default class UpdateValidator extends MessagesCustom {
  constructor(protected ctx: HttpContextContract) {
    super()
  }

  /*
   * Define schema to validate the "shape", "type", "formatting" and "integrity" of data.
   *
   * For example:
   * 1. The username must be of data type string. But then also, it should
   *    not contain special characters or numbers.
   *    ```
   *     schema.string({}, [ rules.alpha() ])
   *    ```
   *
   * 2. The email must be of data type string, formatted as a valid
   *    email. But also, not used by any other user.
   *    ```
   *     schema.string({}, [
   *       rules.email(),
   *       rules.unique({ table: 'users', column: 'email' }),
   *     ])
   *    ```
   */

  public refs = schema.refs({
    id: this.ctx.params.id,
  })

  public schema = schema.create({
    name: schema.string.optional({ trim: true }, [
      rules.maxLength(50),
      rules.minLength(3),
      rules.regex(/^[ a-zA-ZÀ-ÿ\u00f1\u00d1]*$/g),
    ]),
    email: schema.string.optional({ trim: true }, [
      rules.maxLength(50),
      rules.minLength(8),
      rules.email(),
      rules.email(),
      rules.unique({
        table: 'users',
        column: 'email',
        caseInsensitive: true,
        whereNot: {
          secure_id: this.refs.id,
        },
      }),
    ]),
    cpf: schema.string.optional({}, [
      rules.regex(/^\d{3}.\d{3}.\d{3}-\d{2}$/),
      rules.unique({
        table: 'users',
        column: 'cpf',
        whereNot: {
          secure_id: this.refs.id,
        },
      }),
    ]),
    password: schema.string.optional({}, [rules.maxLength(50)]),
    addressId: schema.number.optional([rules.exists({ table: 'address', column: 'id' })]),
    zipCode: schema.string.optional({}, [rules.regex(/^[0-9]{5}-[0-9]{3}$/)]),
    state: schema.string.optional({ trim: true }, [rules.maxLength(2)]),
    city: schema.string.optional({ trim: true }, [rules.maxLength(50)]),
    street: schema.string.optional({ trim: true }, [rules.maxLength(250)]),
    district: schema.string.optional({ trim: true }, [rules.maxLength(250)]),
    number: schema.number.optional([rules.unsigned()]),
    complement: schema.string.optional({ trim: true }, [rules.maxLength(250)]),
  })

  /**
   * Custom messages for validation failures. You can make use of dot notation `(.)`
   * for targeting nested fields and array expressions `(*)` for targeting all
   * children of an array. For example:
   *
   * {
   *   'profile.username.required': 'Username is required',
   *   'scores.*.number': 'Define scores as valid numbers'
   * }
   *
   */
}
