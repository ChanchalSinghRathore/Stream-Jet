import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination
})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description} = req.body
    // TODO: get video, upload to cloudinary, create video

    if (!title || !description)
    {
        throw new ApiError(400, "Title and description are required");
    }

    const thumbNailPath = req.files?.thumbnail?.[0]?.path;
    const uploadVideoPath = req.files?.videoFile?.[0]?.path;

    if (!thumbNailPath) {
        throw new ApiError(400, "thmbnail not uploaded")
    }

    if (!uploadVideoPath) {
        throw new ApiError(400, "Video could not be uploaded")
    }

    const uploadThumbnail = await uploadOnCloudinary(thumbNailPath)

    if (!uploadThumbnail?.url) {
        throw new ApiError(500, "Failed to upload thumbnail");
    }

    const uploadedVideo = await uploadOnCloudinary(uploadVideoPath)

    if (!uploadedVideo?.url) {
        throw new ApiError(500, "Failed to upload video file");
    }
   
    const video = await Video.create({
        title,
        description,
        thumbnail: uploadThumbnail?.url,
        videoFile: uploadedVideo?.url,
        duration: videoFile.duration,
        owner: req.user._id
     })

     res
     .status(200)
     .json(ApiResponse.success("Video Published", video))
    
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail

})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}