import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Category from 'App/Models/Category'
import StoreValidator from 'App/Validators/Category/StoreValidator'
import UpdateValidator from 'App/Validators/Category/UpdateValidator'

export default class CategoriesController {
  public async index({ response, request }: HttpContextContract) {
    const { page, perPage, noPaginate, ...inputs } = request.qs()

    if (noPaginate) {
      return await Category.query().filter(inputs)
    }

    try {
      const categories = await Category.query()
        .filter(inputs)
        .paginate(page || 1, perPage || 10)

      return response.ok({ categories })
    } catch (error) {
      return response.badRequest({
        message: 'Error listing categories',
        originalError: error.message,
      })
    }
  }

  public async store({ response, request }: HttpContextContract) {
    await request.validate(StoreValidator)
    const bodyCategory = request.only(['name', 'observation'])
    let categoryCreated
    const trx = await Database.beginGlobalTransaction()

    try {
      categoryCreated = await Category.create(bodyCategory)
    } catch (error) {
      trx.rollback()
      return response.badRequest({
        message: 'Error in create category',
        originalError: error.message,
      })
    }

    let categoryFind

    try {
      categoryFind = await Category.query().where('id', categoryCreated.id)
    } catch (error) {
      trx.rollback()
      return response.badRequest({
        message: 'Error in create category',
        originalError: error.message,
      })
    }

    trx.commit()
    return response.ok({ categoryFind })
  }

  public async show({ response, params }: HttpContextContract) {
    const categorySecureId = params.id

    try {
      const category = await Category.findByOrFail('id', categorySecureId)
      return response.ok({ category })
    } catch (error) {
      return response.notFound({ message: 'Category not found', originalError: error.message })
    }
  }

  public async update({ response, request, params }: HttpContextContract) {
    await request.validate(UpdateValidator)
    const categorySecureId = params.id
    const bodyCategory = request.only(['name', 'observation'])

    let categoryUpdated
    const trx = await Database.beginGlobalTransaction()

    try {
      categoryUpdated = await Category.findByOrFail('secure_id', categorySecureId)
      categoryUpdated.useTransaction('trx')
      await categoryUpdated.merge(bodyCategory).save()
    } catch (error) {
      trx.rollback()
      return response.badRequest({
        message: 'Error in update category',
        originalError: error.message,
      })
    }

    let categoryFind

    try {
      categoryFind = await Category.findByOrFail('id', categorySecureId)
    } catch (error) {
      trx.rollback()
      return response.badRequest({
        message: 'Error in update category',
        originalError: error.message,
      })
    }

    trx.commit()
    return response.ok({ categoryFind })
  }

  public async destroy({ response, params }: HttpContextContract) {
    const categorySecureId = params.id

    try {
      const category = await Category.findByOrFail('id', categorySecureId)
      await category.delete()
      return response.ok({ message: 'Category successfully deleted' })
    } catch (error) {
      return response.notFound({ message: 'Category not found', originalError: error.message })
    }
  }
}
