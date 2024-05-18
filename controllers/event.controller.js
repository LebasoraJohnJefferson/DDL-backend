const {
    Event,
    EventImages,
    User
  } = require("../models");
  const { cloudinary } = require("../utils/cloudinary");


exports.createEvent = async (req, res) => {
    try {
        const {id} = req.credentials
        const {images,...rest} = req.body
        const {title,description} = rest
        
        if(!title) res.status(409).json({message:'Title is required!'})
        if(!description) res.status(409).json({message:'Description is required!'})

        const event = await Event.create({
            ...rest,
            userId:id
        })


        if (images && images.length > 0) {
            const uploadPromises = images.map(async (image) => {
                try{
                    if(!image.trim()) return
                    const imgRoute = await cloudinary.uploader.upload(image);
                    await EventImages.create({
                        image:imgRoute.secure_url,
                        eventId:event.id
                    })
                }catch(e){
                    console.log(e)
                }
            });

            await Promise.all(uploadPromises);
        }


        res.status(200).json({messaeg:'Event successfully created!'})
    } catch (error) {
        console.log(error);
    }
};

exports.getEvent = async (req,res)=>{
    try {
        const events = await Event.findAll({
            include: [
                {model: EventImages},
                {
                    model: User,
                    attributes:{exclude:['password']},
                },
            ],
            order: [['createdAt', 'DESC']]
        })
        res.status(200).json({event:events})
    } catch (error) {
        console.log(error);
    }
}


exports.deleteEvent = async (req,res)=>{
    const {eventId} = req.params;
    const isEventExist = await Event.findOne({
        where:{
            id:eventId
        }
    })

    if(!isEventExist) return res.status(404).json({message:"Event not found!"})

    await isEventExist.destroy()

    res.status(204).json({message:'Event successfully delted!'})

    try{

    }catch(e){
        console.log(e);
    }
}

exports.publicEvents =async (req,res)=>{
    try {
        const events = await Event.findAll({
            include: [
                {model: EventImages},
                {
                    model: User,
                    attributes:{exclude:['password']},
                },
            ],
            where:{
                privacy:'All'
            },
            order: [['createdAt', 'DESC']]
        })
        res.status(200).json({event:events})
    } catch (error) {
        console.log(error)
    }
}


exports.publicImages = async (req,res)=>{
    try {
        const images = await EventImages.findAll({
            order: [['createdAt', 'DESC']],
            limit:10
        })

        res.status(200).send({images:images})
    } catch (error) {
        console.log(error)
    }
}