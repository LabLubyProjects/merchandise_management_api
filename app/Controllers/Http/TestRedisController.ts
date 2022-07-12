import Redis from '@ioc:Adonis/Addons/Redis'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class TestRedisController {
  public async store({ response }: HttpContextContract) {
    const name = await Redis.set('nome', 'Nome')
    return response.ok({ name })
  }

  public async show({ response }: HttpContextContract) {
    const name = await Redis.get('nome')
    return response.ok({ name })
  }

  public async destroy({ response }: HttpContextContract) {
    await Redis.del('nome')
    return response.ok({ message: 'Key deleted' })
  }
}
