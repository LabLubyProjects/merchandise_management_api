import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UsersController {
  public async index({ response }: HttpContextContract) {
    response.ok({ message: 'user works' })
  }

  public async store({ response }: HttpContextContract) {
    response.ok({ message: 'user works' })
  }

  public async show({ response }: HttpContextContract) {
    response.ok({ message: 'user works' })
  }

  public async update({ response }: HttpContextContract) {
    response.ok({ message: 'user works' })
  }

  public async destroy({ response }: HttpContextContract) {
    response.ok({ message: 'user works' })
  }
}
