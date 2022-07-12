import { BaseTask } from 'adonis5-scheduler/build'
import Logger from '@ioc:Adonis/Core/Logger'
import dayjs from 'dayjs'
import isLeapYear from 'dayjs/plugin/isLeapYear'
import 'dayjs/locale/pt-br'
import Cart from 'App/Models/Cart'

export default class VerifyTimeItemCart extends BaseTask {
  public static get schedule() {
    return '1 35 12 * * *'
  }
  /**
   * Set enable use .lock file for block run retry task
   * Lock file save to `build/tmpTaskLock`
   */
  public static get useLock() {
    return false
  }

  public async handle() {
    dayjs.extend(isLeapYear)
    dayjs.locale('pt-br')
    try {
      const itemsCart = await Cart.all()
      await Promise.all(
        itemsCart.map(async (item) => {
          const { createdAt } = item.serialize()
          const newDateMoreOneHour = dayjs(createdAt).add(1, 'h').format()
          const currentDate = dayjs().format()

          if (newDateMoreOneHour < currentDate) {
            try {
              await item.delete()
              return Logger.info('Item removed')
            } catch (error) {
              return Logger.error('Error in deleting item')
            }
          }
        })
      )
    } catch (error) {
      Logger.error('Error returning cart items')
    }
  }
}
