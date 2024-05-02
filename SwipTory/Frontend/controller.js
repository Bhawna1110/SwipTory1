require('dotenv').config();
const Bcryptjs = require("bcryptjs"); /* For encryption and decryption */
const ObjectId = require('mongoose').Types.ObjectId
const generatedSalt = Bcryptjs.genSaltSync(10);
const jwt = require('jsonwebtoken');
const { 
    storyCategoryModel: StoryCategoryModel , 
    storyModel: StoryModel,
    userModel: UserModel
} = require('../model/init-model')
class WebStories {
    async webStoriesCategoryList(req,res) {
        try {
            const storyList = await StoryCategoryModel.find()
            return res.status(200).json({ status: 200, message: 'Story Category list fetch successfully', data: storyList })
        } catch (error) { 
            console.log('Error:', error)
            return res.status(500).json({ status:500, message: 'Internal server error' })
        }
    }
    async webStoriesList(req,res) {
        try {

            let { perPage = 4, page = 1, story_category_id} = req.query;
            perPage = parseInt(perPage);
            page = parseInt(page);
            const offset = perPage * (page - 1);

            const match = {
                story_category_id: new ObjectId(story_category_id)
            }

            const pipeline = [
                {
                    $match: match
                },
                {
                    $facet: {
                        list: [{ $skip: offset }, { $limit: perPage }],
                        count: [
                            {
                                $count: 'count'
                            }
                        ]
                    }
                },
                {
                    $unwind: "$count"
                }
            ]
            const storyList = await StoryModel.aggregate(pipeline)
            return res.status(200).json({ status: 200, message: 'Story list fetch successfully', data: storyList })
        } catch (error) { 
            console.log('Error:', error)
            return res.status(500).json({ status:500, message: 'Internal server error' })
        }
    }
    async register(req, res) {
        try {
            if(!req.body.user_name || !req.body.password) {
                return res.status(403).json({ status:403, message: 'Invalid request' })
            }
            const existsUserName = await UserModel.findOne({user_name: req.body.user_name})
            if(existsUserName) {
                return res.status(403).json({ status:403, message: 'Username already taken' })
            }
            // console.log('existsUserName"', req.body.user_name, password);
            const password = await Bcryptjs.hash(req.body.password, generatedSalt);
            const savedUserData =  await UserModel.create({
                user_name: req.body.user_name,
                password: password
            })
            // await savedUserData.save()
            return res.status(200).json({ status:200, message: 'User created successfully', data: savedUserData })
        } catch (error) {
            console.log('Error:', error)
            return res.status(500).json({ status:500, message: 'Internal server error' })
        }
    }
    
    async login(req, res) {
        try {
            if(!req.body.user_name || !req.body.password) {
                return res.status(403).json({ status:403, message: 'Internal server error' })
            }
            const user = await UserModel.findOne({user_name: req.body.user_name})
            if (!Bcryptjs.compareSync(req.body.password, user.password)) {
                return res.status(401).json({ status: 401, message: 'Username or password incorrect' });
            }
            const token = jwt.sign(
                {
                    userId: user._id,
                },
                process.env.JWT_TOKEN_SECRET,
                {
                    expiresIn: process.env.JWT_EXPIRE_IN_HOURS,
                    algorithm: process.env.JWT_TOKEN_ALGO
                }
            );
            return res.status(200).json({ status:200, message: 'LoggedIn successfully', token, user_data: user })
        } catch (error) {
            console.log('Error:', error)
            return res.status(500).json({ status:500, message: 'Internal server error' })
        }
    }

    async createStory (req, res) {
        try {
            const categoryId = req.body.story_category_id
            const slideList = req.body.slide_array
            const userId = req.userId
            if (!categoryId) {
            return res.status(403).json({ status: 403, message: 'Category id required' })
            }
            if (!slideList.length || slideList.length < 3 || slideList > 6) {
                return res.status(403).json({ status: 403, message: 'Invalid slides' })
            }
            for(const slide of slideList) {
                if(!slide.heading || !slide.description || !slide.image || !slide.story_category_id) {
                    return res.status(403).json({ status: 403, message: 'Invalid request data'})
                } else if (slide.story_category_id !== categoryId) {
                    return res.status(403).json({ status: 403, message: 'All slide should have same cotegory'})
                }
                slide.user_id =  userId
            }
            await StoryModel.create({
                user_id: userId,
                story_category_id: categoryId,
                slide_list: slideList
            })
            return res.status(200).json({ status:200, message: 'Slide save successfully'})
        } catch (error) {
            console.log('Error:', error)
            return res.status(500).json({ status:500, message: 'Internal server error' })
        }
    }
    async userStory(req,res) {
        try {
            const userId = req.userId
            let { perPage = 4, page = 1} = req.query;
            perPage = parseInt(perPage);
            page = parseInt(page);
            const offset = perPage * (page - 1);

            const match = {
                user_id: new ObjectId(userId)
            }
            const pipeline = [
                {
                    $match: match
                },
                {
                    $facet: {
                        list: [{ $skip: offset }, { $limit: perPage }],
                        count: [
                            {
                                $count: 'count'
                            }
                        ]
                    }
                },
                {
                    $unwind: "$count"
                }
            ]
            const storyList = await StoryModel.aggregate(pipeline)
            return res.status(200).json({ status:200, message: 'User story fetch successfully ', data: storyList })
        } catch (error) {
            console.log('Error:', error)
         return res.status(500).json({ status:500, message: 'Internal server error' })
        }
    }
    async storyDetail(req,res) {
        try {
            const storyId = req.query.story_id
            if(!storyId) {
                return res.status(403).json({ status:403, message: 'Invalid request' })
            }
            const story = await StoryModel.findOne({_id: new ObjectId(storyId)})
            return res.status(200).json({ status:200, message: 'Story fetch successfully', data: story })
        } catch (error) {
            console.log('Error:', error)
            return res.status(500).json({ status:500, message: 'Internal server error' })
        }
    }
    async editStory(req, res) {
        try {
            const categoryId = req.body.story_category_id
            const storyId = req.body.story_id
            const slideList = req.body.slide_array
            const userId = req.userId

            if (!categoryId) {
                return res.status(403).json({ status: 403, message: 'Category id required' })
                }
            if (!storyId) {
                return res.status(403).json({ status: 403, message: 'story id required' })
                }
                if (!slideList.length || slideList.length < 3 || slideList > 6) {
                    return res.status(403).json({ status: 403, message: 'Invalid slides' })
                }
                for(const slide of slideList) {
                    if(!slide.heading || !slide.description || !slide.image || !slide.story_category_id) {
                        return res.status(403).json({ status: 403, message: 'Invalid request data'})
                    } else if (slide.story_category_id !== categoryId) {
                        return res.status(403).json({ status: 403, message: 'All slide should have same cotegory'})
                    }
                    slide.user_id =  userId
                }
            const storyDetail = await StoryModel.findOne({_id: new ObjectId(storyId), user_id: userId})
            if (!storyDetail) {
                return res.status(404).json({ status:404, message: 'Story not found' })
            }
            storyDetail.slide_list= slideList
            storyDetail.story_category_id = categoryId 
            const savedStory = await storyDetail.save()
            return res.status(200).json({ status:200, message: 'Story Edit successfully', data: savedStory })
        } catch (error) {
            console.log('Error:', error)
            return res.status(500).json({ status:500, message: 'Internal server error' })
        }
    }

    async bookmarkStory(req,res) {
        try {
            const storyId = req.body.story_id
            const userId = req.userId
            if(!storyId) {
                return res.status(403).json({ status:403, message: 'Invalid request' })
            }
            const userData = await UserModel.findOne({ _id: new ObjectId(userId)})
            const isAlreadyBookmarked = userData.bookmark_story_ids.indexOf(new ObjectId(storyId))
            if(isAlreadyBookmarked == -1) {
                userData.bookmark_story_ids.push(storyId)
            } else {
                userData.bookmark_story_ids.splice(isAlreadyBookmarked, 1)
            }
            userData.save()
            return res.status(200).json({ status:200, message: 'Bookmarked successfully', data: userData })
        } catch (error) {
            console.log('Error:', error)
            return res.status(500).json({ status:500, message: 'Internal server error' })
        }
    }
    async likedStory(req,res) {
        try {
            const storyId = req.body.story_id
            const userId = req.userId
            if(!storyId) {
                return res.status(403).json({ status:403, message: 'Invalid request' })
            }
            const userData = await UserModel.findOne({ _id: new ObjectId(userId)})
            const storyData = await StoryModel.findOne({ _id: new ObjectId(storyId)})
            const isAlreadyLiked = userData.liked_ids.indexOf(new ObjectId(storyId))

            if(isAlreadyLiked == -1) {
                userData.liked_ids.push(storyId)
                storyData.likes += 1
            } else {
                userData.liked_ids.splice(isAlreadyLiked, 1)
                storyData.likes -= 1
            }
            userData.save()
            return res.status(200).json({ status:200, message: 'Liked successfully', data: userData })
        } catch (error) {
            console.log('Error:', error)
            return res.status(500).json({ status:500, message: 'Internal server error' })
        }
    }
    async getBookmarkStory(req,res) {
        try {
            const userId = req.userId
            let { perPage = 4, page = 1} = req.query;
            perPage = parseInt(perPage);
            page = parseInt(page);
            const offset = perPage * (page - 1);
            const userData= await UserModel.findOne({_id: new ObjectId(userId)})
            console.log('userData.bookmark_story_ids::',userData.bookmark_story_ids); 
            const match = {
                _id: { $in: userData.bookmark_story_ids}
            }

            const pipeline = [
                {
                    $match: match
                },
                {
                    $facet: {
                        list: [{ $skip: offset }, { $limit: perPage }],
                        count: [
                            {
                                $count: 'count'
                            }
                        ]
                    }
                },
                {
                    $unwind: "$count"
                }
            ]
            const bookmarkStoryList = await StoryModel.aggregate(pipeline)
            return res.status(200).json({ status:200, message: 'Bookmark stories fetch successfully', data: bookmarkStoryList }) 
        } catch (error) {
            console.log('Error:', error)
            return res.status(500).json({ status:500, message: 'Internal server error' })
        }
    }
}

module.exports = new WebStories()