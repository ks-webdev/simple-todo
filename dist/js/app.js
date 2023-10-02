const add = document.querySelector('form button')
const section = document.querySelector('section')
const clearBtn = document.querySelector('.clear button')

add.addEventListener('click', (e) => {
  e.preventDefault()

  // get the input values
  let form = e.target.parentElement
  let todoText = form.children[0].value
  let todoMonth = form.children[1].value
  let todoDay = form.children[2].value

  if (todoMonth.length < 2) {
    todoMonth = '0' + todoMonth
  }

  if (todoDay.length < 2) {
    todoDay = '0' + todoDay
  }

  let todoDate = todoMonth.toString() + todoDay.toString() //String

  if ((todoText === '') | (todoDate === '')) {
    alert("Please make sure you've already entered text and date.")
    return
  }

  if (
    (todoMonth > 12 || todoMonth <= 0) |
    (todoDay > 31 || todoDay <= 0) |
    (todoDay.length > 2) |
    (todoMonth.length > 2)
  ) {
    alert("正しい日付をご入力ください。")
    return 
  }

  let errorMonths = ['0230', '0231', '0431', '0631', '0931', '1131']

  for (let n = 0; n < errorMonths.length; n++) {
    if (errorMonths[n] == todoDate) {
      alert("正しい日付をご入力ください。")
      return 
    }
  }

  // create a todo list
  let todo = document.createElement('div')
  todo.classList.add('todo')

  let text = document.createElement('p')
  text.classList.add('todo-text')
  text.innerText = todoText

  let time = document.createElement('p')
  time.classList.add('todo-time')
  time.innerText = todoMonth.toString() + '/' + todoDay.toString()

  todo.appendChild(text)
  todo.appendChild(time)

  // チェックボタン
  let completeBtn = document.createElement('button')
  completeBtn.classList.add('complete')

  completeBtn.innerHTML = '<i class="fas fa-check"></i>'
  completeBtn.addEventListener('click', (e) => {
    let todoItem = e.target.parentElement
    todoItem.classList.toggle('done')
  })

  // ゴミ箱ボタン
  let trashBtn = document.createElement('button')
  trashBtn.classList.add('trash')
  trashBtn.innerHTML = '<i class="fas fa-trash"></i>'

  trashBtn.addEventListener('click', (e) => {
    let todoItem = e.target.parentElement
    todoItem.style = 'animation: scaleDown 0.3s forwards;'


    todoItem.addEventListener('animationend', () => {
      // ローカルストレジから消す
      let text = todoItem.children[0].innerText
      let myListArray = JSON.parse(localStorage.getItem('list'))
      myListArray.forEach((item, index) => {
        if (item.todoText == text) {
          myListArray.splice(index, 1)
          localStorage.setItem('list', JSON.stringify(myListArray))
        }
      })

      todoItem.remove()
    })
    todo.style.animation = 'scaleUp 0.3s forwards'
  })

  todo.appendChild(completeBtn)
  todo.appendChild(trashBtn)

  // オブジェクト
  let myTodo = {
    todoText: todoText,
    todoMonth: todoMonth,
    todoDay: todoDay,
    todoDate: todoDate,
  }

  // store data into an array of objects
  let myList = localStorage.getItem('list')
  if (myList == null) {
    localStorage.setItem('list', JSON.stringify([myTodo]))
  } else {
    let myListArray = JSON.parse(myList)
    myListArray.push(myTodo)
    localStorage.setItem('list', JSON.stringify(myListArray))
  }

  form.children[0].value = ''

  section.appendChild(todo)
})
loadData()

function loadData() {
  let myList = localStorage.getItem('list')

  if (myList !== null) {
    let myListArray = JSON.parse(myList)
    myListArray.forEach((item) => {
      let todo = document.createElement('div')
      todo.classList.add('todo')
      let text = document.createElement('p')
      text.classList.add('todo-text')
      text.innerText = item.todoText
      let time = document.createElement('todo-time')
      time.classList.add('todo-time')
      time.innerText = item.todoMonth + '/' + item.todoDay

      todo.appendChild(text)
      todo.appendChild(time)

      // チェックボタン
      let completeBtn = document.createElement('button')
      completeBtn.classList.add('complete')

      completeBtn.innerHTML = '<i class="fas fa-check"></i>'
      completeBtn.addEventListener('click', (e) => {
        let todoItem = e.target.parentElement
        todoItem.classList.toggle('done')
      })

      // ゴミ箱ボタン
      let trashBtn = document.createElement('button')
      trashBtn.classList.add('trash')
      trashBtn.innerHTML = '<i class="fas fa-trash"></i>'

      trashBtn.addEventListener('click', (e) => {
        let todoItem = e.target.parentElement
        todoItem.style = 'animation: scaleDown 0.3s forwards;'

        todoItem.addEventListener('animationend', () => {
          // ローカルストレジから消す
          let text = todoItem.children[0].innerText
          let myListArray = JSON.parse(localStorage.getItem('list'))
          myListArray.forEach((item, index) => {
            if (item.todoText == text) {
              myListArray.splice(index, 1)
              localStorage.setItem('list', JSON.stringify(myListArray))
            }
          })

          todoItem.remove()
        })
        todo.style.animation = 'scaleUp 0.3s forwards'
      })

      todo.appendChild(completeBtn)
      todo.appendChild(trashBtn)

      section.appendChild(todo)
    })
  }
}

// フィルター機能
function mergeTime(arr1, arr2) {
  let result = []
  let i = 0
  let j = 0

  while (i < arr1.length && j < arr2.length) {
    if (Number(arr1[i].todoDate) > Number(arr2[j].todoDate)) {
      result.push(arr2[j])
      j++
    } else if (Number(arr1[i].todoDate) < Number(arr2[j].todoDate)) {
      result.push(arr1[i])
      i++
    } else {
      result.push(arr1[i])
      i++
    }
  }

  while (i < arr1.length) {
    result.push(arr1[i])
    i++
  }
  while (j < arr2.length) {
    result.push(arr2[j])
    j++
  }
  return result
}

function mergeSort(arr) {
  if (arr.length === 1) {
    return arr
  } else {
    let middle = Math.floor(arr.length / 2)
    let right = arr.slice(0, middle)
    let left = arr.slice(middle, arr.length)
    return mergeTime(mergeSort(right), mergeSort(left))
  }
}

let sortButton = document.querySelector('div.sort button')
sortButton.addEventListener('click', () => {
  let sortedArray = mergeSort(JSON.parse(localStorage.getItem('list')))
  localStorage.setItem('list', JSON.stringify(sortedArray))


  let len = section.children.length
  for (let i = 0; i < len; i++) {
    section.children[0].remove()
  }


  loadData()
})

function clearData() {
  clearBtn.addEventListener('click', (e) => {
    e.preventDefault()
    localStorage.clear()
    section.remove()
    location.reload()
  })
}

clearData()
