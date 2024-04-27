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