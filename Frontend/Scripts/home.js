const url = `https://maxy-shoplist.herokuapp.com/api/v1`
const productMenu = document.querySelector('.add_product-container')
const exitBtn = document.querySelector('#add-product_exit')
const addProductIcon = document.querySelector('#add-product_icon')
const productImage = document.querySelector('#product_image-input')
const addProductForm = document.querySelector('.add-product_form')
const addProductBtn = document.querySelector('#product_submit-btn')
const addFormImage = document.querySelector('#add-form_image')
const addImageLoader = document.querySelector('.add-image_loader')
const productName = document.querySelector('#product_name-input')
const productPrice = document.querySelector('#product_price-input')
const addProductMsg = document.querySelector('.add-product_msg')
const productEntryContainer = document.querySelector('.product_lists')
const entriesLoader = document.querySelector('.loading-entries')
const networkMsg = document.querySelector('.network-msg')
let imageSrc
let isEditing = false
let editID

// default params
const setDefault = (
    isEditingValue,
    productNameValue,
    productPriceValue,
    productImageValue
) => {
    isEditing = isEditingValue
    productName.value = productNameValue
    productPrice.value = productPriceValue
    productImage.value = productImageValue
}

const getMyId = async() => {
    const token = localStorage.getItem('accessToken')
    networkMsg.classList.remove('reveal-network-msg')

    try {
        const {
            data: { user },
        } = await axios.get(`${url}/shoplist/username`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        localStorage.setItem('user', user)
    } catch (error) {
        localStorage.removeItem('username')
        localStorage.removeItem('accessToken')
        networkMsg.innerHTML = 'There seem to be an Error...'
        networkMsg.classList.add('reveal-network-msg')
        setTimeout(() => {
            window.location.href = '../Pages/login.html'
        }, 2000)
    }
}

const getSingleEntry = async(dataID) => {
    const token = localStorage.getItem('accessToken')
    addImageLoader.classList.add('reveal-image_loader')

    try {
        const {
            data: { entry },
        } = await axios.get(`${url}/shoplist/${dataID}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        addImageLoader.classList.remove('reveal-image_loader')

        const { name, price, image } = entry
        productName.value = name
        productPrice.value = price
        addFormImage.classList.remove('hide-form_image')
        addFormImage.src = image
        addFormImage.alt = name
    } catch (error) {
        console.log(error)
    }
}

// handle update all entries

const updateEntryProducts = async() => {
        const token = localStorage.getItem('accessToken')
        entriesLoader.classList.add('reveal-loading-entries')
        try {
            const {
                data: { entry },
            } = await axios.get(`${url}/shoplist`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            networkMsg.classList.remove('reveal-network-msg')
            const userToken = localStorage.getItem('user')
            let newEntry = [...entry]
            const allEntries = newEntry
                .map((value) => {
                        const { name, price, image, _id, createdBy } = value
                        return `
              <div class="entry-item_container" data-id=${_id}>
                      <img src=${image} alt=${name} />
                      <div class="entry_details-container">
                          <div class="entry_details">
                              <h3>${name}</h3>
                              <p>N${price}</p>
                          </div>
                          ${
                            userToken === createdBy
                              ? `
                              <div class='entry_controls'>
                                <i
                                  class='fa-solid fa-trash'
                                  id='entry_delete'
                                ></i>
                                <i class='fa-solid fa-pen' id='entry_edit'></i>
                              </div>
                              `
                              : ``
                          }

                      </div>
                  </div>`
      })
      .join('')
    entriesLoader.classList.remove('reveal-loading-entries')
    productEntryContainer.innerHTML = allEntries

    // get all delete buttons from entries
    const allDeleteBtns =
      productEntryContainer.querySelectorAll('#entry_delete')
    allDeleteBtns.forEach((deleteBtn) => {
      deleteBtn.addEventListener('click', (e) => {
        const getParentElement =
          e.target.parentElement.parentElement.parentElement
        const getDataID = getParentElement.dataset.id
        handleDeleteClick(getDataID)
      })
    })

    // get all edit buttons from entries
    const allEditBtns = productEntryContainer.querySelectorAll('#entry_edit')
    allEditBtns.forEach((editBtn) => {
      editBtn.addEventListener('click', (e) => {
        const getParentElement =
          e.target.parentElement.parentElement.parentElement
        const getDataID = getParentElement.dataset.id
        editID = getDataID
        getSingleEntry(getDataID)
        isEditing = true
        enterProductMenu()
      })
    })
  } catch (error) {
    entriesLoader.classList.remove('reveal-loading-entries')
    networkMsg.innerHTML = 'Connection Problem'
    networkMsg.classList.add('reveal-network-msg')
    console.log(error)
  }
}

// handle delete entry event

const handleDeleteClick = async (id) => {
  const token = localStorage.getItem('accessToken')
  networkMsg.classList.remove('reveal-network-msg')
  try {
    await axios.delete(`${url}/shoplist/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    updateEntryProducts()
  } catch (error) {
    networkMsg.innerHTML = 'There seem to be an Error...'
    networkMsg.classList.add('reveal-network-msg')
  }
}

// handle edit entry event
const handleEditClick = async () => {
  const productNameValue = productName.value
  const productPriceValue = productPrice.value
  const token = localStorage.getItem('accessToken')
  try {
    await axios.patch(
      `${url}/shoplist/${editID}`,
      {
        name: productNameValue,
        price: productPriceValue,
        image: imageSrc,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    addImageLoader.classList.remove('reveal-image_loader')
    addProductMsg.innerHTML = 'Entry Edited Successfully'
  } catch (error) {
    addImageLoader.classList.remove('reveal-image_loader')
    console.log(error)
  }
}

// reveal add product menu
const enterProductMenu = () => {
  productMenu.classList.add('reveal_product-container')
}

// hide add product menu
const exitProductMenu = () => {
  productMenu.classList.remove('reveal_product-container')
  setDefault(false, '', '', '')
  editID = ''
  addFormImage.classList.add('hide-form_image')
}

// upload product image
const addProductImage = async (e) => {
  e.preventDefault()
  const imageFile = e.target.files[0]
  const formData = new FormData()
  formData.append('image', imageFile)
  const token = localStorage.getItem('accessToken')
  const productImageValue = productImage.value
  addImageLoader.classList.add('reveal-image_loader')
  try {
    const {
      data: {
        image: { src },
      },
    } = await axios.post(`${url}/upload`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    })

    addFormImage.src = src
    addFormImage.alt = productImageValue
    imageSrc = src

    if (addFormImage.src) {
      addImageLoader.classList.remove('reveal-image_loader')
      addFormImage.classList.remove('hide-form_image')
    }
  } catch (error) {
    addImageLoader.classList.remove('reveal-image_loader')
    addFormImage.classList.add('hide-form_image')
    addProductMsg.innerHTML = 'Connection Error...'
  }

  setTimeout(() => {
    addProductMsg.innerHTML = ''
  }, 2000)
}

// add product to entries
const addProduct = async (e) => {
  e.preventDefault()
  const productNameValue = productName.value
  const productPriceValue = productPrice.value
  const token = localStorage.getItem('accessToken')
  addImageLoader.classList.add('reveal-image_loader')
  try {
    if (!productNameValue || !productPriceValue || !imageSrc) {
      addImageLoader.classList.remove('reveal-image_loader')
      addProductMsg.innerHTML = 'Please fill up credentials!'
    } else if (productNameValue && productPriceValue && imageSrc && isEditing) {
      handleEditClick()
      updateEntryProducts()
      addFormImage.classList.add('hide-form_image')
      setDefault(false, '', '', '')
      editID = ''
    } else {
      const {
        data: {
          entry: { createdBy },
        },
      } = await axios.post(
        `${url}/shoplist`,
        {
          name: productNameValue,
          price: productPriceValue,
          image: imageSrc,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      updateEntryProducts()
      addImageLoader.classList.remove('reveal-image_loader')
      localStorage.setItem('user', createdBy)
      addProductMsg.innerHTML = 'Entry Created Successfully'
      addFormImage.classList.add('hide-form_image')
      setDefault(false, '', '', '')
      editID = ''
    }
  } catch (error) {
    const {
      response: {
        data: { msg },
      },
    } = error
    const errorTxt = msg.replace('Path `name`', 'Product name')
    addImageLoader.classList.remove('reveal-image_loader')
    addProductMsg.innerHTML = errorTxt
  }

  setTimeout(() => {
    addProductMsg.innerHTML = ''
  }, 2000)
}

productImage.addEventListener('change', addProductImage)
addProductIcon.addEventListener('click', enterProductMenu)
exitBtn.addEventListener('click', exitProductMenu)
addProductForm.addEventListener('submit', addProduct)
addProductBtn.addEventListener('click', addProduct)

// on window load
window.addEventListener('DOMContentLoaded', () => {
  addFormImage.classList.add('hide-form_image')
  const token = localStorage.getItem('accessToken')
  if (!token) {
    window.location.href = '../Pages/login.html'
  }
  updateEntryProducts()
  getMyId()
})