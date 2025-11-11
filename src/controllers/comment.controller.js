import mongoose from "mongoose"
import {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query
    if(!mongoose.isValidObjectId(videoId)){
        throw new ApiError(400, "Invalid video ID");
    }
    const filter = {video: videoId};
    const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        populate: {path: "owner", select: "name email"},
        sort: {createdAt: -1}
    };
    const result = await Comment.aggregatePaginate(Comment.aggregate([{$match: filter}]), options);
    res.status(200).json(new ApiResponse(200, {
        comments: result.docs,
        pagination: {
            total: result.totalDocs,
            page: result.page,
            limit: result.limit,
            totalPages: result.totalPages
        }
    }, "Comments fetched successfully"));

})

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    const {videoId} = req.params
    const {content} = req.body

    if(!content){
        throw new ApiError(400, "Content is required");
    }
    const video = await video.findById(videoId);

    if(!video){
        throw new ApiError(400, "Video not found");
    }
    const comment = await new Comment ({
        content,
        video: videoId,
        owner: req.user._id
    });
    await comment.save();
    res.status(201).json(new ApiResponse(201, comment, "Comment added successfully"));
})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    const {commentId} = req.params
    const {content} = req.body
    if(!content){
        throw new ApiError(400, "Content is required");
    }
    if(!mongoose.isValidObjectId(commentId)){
        throw new ApiError(400, "Invalid comment ID");
    }
    const comment = await Comment.findById(commentId);
    if(!comment){
        throw new ApiError(404, "Comment not found");
    }
    if(comment.owner.toString() !== req.user._id.toString()){
        throw new ApiError(403, "You are not authorized to update this comment");
    }
    comment.content = content;
    await comment.save();
    res.status(200).json(new ApiResponse(200, comment, "Comment updated successfully"));

})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
    const {commentId} = req.params
    if(!mongoose.isValidObjectId(commentId)){
        throw new ApiError(400, "Invalid comment ID");
    }
     const comment = await Comment.findById(commentId);
    if(!comment){
        throw new ApiError(404, "Comment not found");
    }
    if(comment.owner.toString() !== req.user._id.toString()){
        throw new ApiError(403, "You are not authorized to delete this comment");
    }
    comment.deleteOne();

})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }