export class Todo {
  static #NAME = 'todo'

  static #saveData = () => {
    localStorage.setItem(
      this.#NAME,
      JSON.stringify({
        list: this.#list,
        count: this.#count,
      }),
    )
  }

  static #loadData = () => {
    const data = localStorage.getItem(this.#NAME)

    if (data) {
      const { list, count } = JSON.parse(data)
      this.#list = list
      this.#count = count
    }
  }

  static #list = []
  static #count = 0

  // додає новий об'єкт, тобто додає наше завдання, яке зберігається в #list
  static #createTaskData = (text) => {
    this.#list.push({
      id: ++this.#count, //для нумерації задвань
      text,
      done: false,
    })
  }

  static #block = null //посилання на елемент. По факту це наш main, task list
  static #template = null //посилання на template, окремий винесений блок коду
  static #input = null
  static #button = null

  static init = () => {
    this.#template =
      document.getElementById(
        'task',
      ).content.firstElementChild

    // console.log(this.#template)

    this.#block = document.querySelector('.task__list')

    this.#input = document.querySelector('.form__input')

    this.#button = document.querySelector('.form__button')

    this.#button.onclick = this.#handleAdd // при натиканні на кнопку виконоюється метод handleAdd

    this.#loadData()

    this.#render()
  }

  // контролюємо створення нового завдання, тобто самого task
  static #handleAdd = () => {
    const value = this.#input.value

    if (value.length > 1) {
      this.#createTaskData(value) //витягуємо значення, яке приходить з input
      this.#input.value = '' // очищуємо поле вводу, для того щоб після натикання на 'додати' поле ставоло пустим
      this.#render()
      this.#saveData()
    }

    console.log(this.#list)
  }

  static #render = () => {
    this.#block.innerHTML = ''

    if (this.#list.length === 0) {
      this.#block.innerText = 'Наразі список завдань пустий'
    } else {
      this.#list.forEach((taskData) => {
        const el = this.#createTaskElem(taskData)
        this.#block.append(el) // до блоку додаємо цей елемент
      })
    }
  }

  // приклад  //   const el = this.#template.cloneNode(true) // клонування темплейту

  static #createTaskElem = (data) => {
    const el = this.#template.cloneNode(true)

    const [id, text, btnDo, btCancel] = el.children // через диструктиризацію звертаємось до діва task, до його внутрішніх елементів

    id.innerHTML = `${data.id}.`
    text.innerHTML = data.text

    btCancel.onclick = this.#handleCancel(data)
    btnDo.onclick = this.#handleDo(data, btnDo, el)

    if (data.done) {
      el.classList.add('task--done')
      btnDo.classList.remove('task__button--do')
      btnDo.classList.add('task__button--done')
    }

    return el
  }

  static #handleDo = (data, btn, el) => () => {
    const result = this.#toggleDone(data.id)

    if (result === true || result === false) {
      el.classList.toggle('task--done')
      btn.classList.toggle('task__button--do')
      btn.classList.toggle('task__button--done')

      this.#saveData()
    }
  }

  static #toggleDone = (id) => {
    const task = this.#list.find((item) => item.id === id)

    if (task) {
      task.done = !task.done
      return task.done
    } else {
      return null
    }
  }

  //видалення задач
  static #handleCancel = (data) => () => {
    if (confirm('Видалити завдання?')) {
      const result = this.#deleteById(data.id)
      if (result) {
        this.#render()
        this.#saveData()
      }
    }
  }

  // відновлює list відфільтруваваши по id i повертає true, щоб розуміти, що дія відбулась
  static #deleteById = (id) => {
    this.#list = this.#list.filter((item) => item.id !== id)
    return true
  }
}

Todo.init()
window.todo = Todo
