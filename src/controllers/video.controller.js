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
     .json(new ApiResponse(200,"Video Published", video))
    
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id
    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, "Invalid video ID")
    }
    const video = await Video.findById(videoId)
    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    res
    .status(200)
    .json(new ApiResponse(200, video, "video fetched successfully"))
    


})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail
    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, "Invalid video ID")
    }

    if (video.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to update this video");
    }

    const {updatedTitle, updatedDescription, updatedThumbnail} = req.body

    if (!updatedTitle && !updatedDescription && !updatedThumbnail) {
        throw new ApiError(400, "action required, no updated data provided")
    }

    const updatedThumbnailLocalPath = req.files?.thumbnail?.[0]?.path

    if (!updatedThumbnailLocalPath) {
        throw new ApiError(400, "updated thumbnail not found or uploaded by user")
    }

    const thumbnail = await uploadOnCloudinary(updatedThumbnailLocalPath)

    if (!thumbnail.url) {
        throw new ApiError(500, "thumbnail could not be uploaded on cloudinary")
    }

    const video = await Video.findByIdAndUpdate(
        videoId,
        {
            $set:{
                title: updatedTitle,
                description: updatedDescription,
                thumbnail: thumbnail.url
            }
        },
        {new: true}
    )

    res
    .status(200)
    .json(new ApiResponse(200, video, "All details updated successfully"))
    
})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, "Invalid video ID")
    }

    const video = await Video.findById(videoId)

    if (!video) { 
        throw new ApiError(404, "Video not found")
    }

    if(video.owner.toString()!==req.user?._id.toString()){
      throw new ApiError(403,"You are not authorized to delete this video")
   }
    
    Video.findByIdAndDelete(videoId)

    res
    .status(200)
    .json(new ApiResponse(200, {}, "Video deleted successfully"))

})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, "Invalid video ID")
    }

    const video = await Video.findById(videoId)

    if (!video) {
        throw new ApiError(404, "video not found")
    }

    if (video.owner.toString() !== req.user?._id.toString()) {
      throw new ApiError(403, "You are not authorized to toggle publish status");
    }

    const VideoToggleStatus = await Video.findByIdAndUpdate(
        videoId,
        { isPublished: !video.isPublished },
        { new: true, runValidators: false } // new:true returns updated doc
    );

    const message = VideoToggleStatus.isPublished
        ? "Video published successfully"
        : "Video unpublished successfully";

    res
    .status(200)
    .json(new ApiResponse(200, VideoToggleStatus, message))
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}