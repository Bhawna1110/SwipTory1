const router = require('express').Router()
const services = require('../controller/controller') 
const isAuth = require('../middleware/auth').authentication

router.get('/story/category-list', services.webStoriesCategoryList.bind(services))
router.get('/story/list', services.webStoriesList.bind(services))
router.post('/register', services.register.bind(services))
router.post('/login', services.login.bind(services))
router.post('/story/create', isAuth, services.createStory.bind(services))
router.get('/story/user-created', isAuth, services.userStory.bind(services))
router.get('/story/detail', services.storyDetail.bind(services))
router.post('/story/edit', isAuth, services.editStory.bind(services))
router.post('/story/bookmark', isAuth, services.bookmarkStory.bind(services))
router.post('/story/like', isAuth,services.likedStory.bind(services))
router.get('/story/bookmark-list', isAuth, services.getBookmarkStory.bind(services))

module.exports = router