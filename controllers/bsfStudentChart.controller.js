const {
    Faculty, Course, User, UserCredential,BsfStudentChart
  } = require("../models");
  const { Op } = require('sequelize');

exports.createStudentChart = async (req,res)=>{
    try {
      const {userId} = req.body

        const isUserExist = await User.findOne({
          where:{
            id:userId
          }
        })

        if(!isUserExist) return res.status(404).json({message:"User not Found"})


        const isRegisted = await BsfStudentChart.findOne({
          include:[
            {model:User}
          ],
          where:{
            '$User.id$':userId
          }
        })

        if(isRegisted) return res.status(409).json({message:"User already registered"})

        await BsfStudentChart.create(req.body)
        res.status(200).json({message:"Successfully Created!"})
    } catch (error) {
        console.log(error)
    }
}


exports.getStudentWithNoRole = async (req,res)=>{
  try {
    const users = await User.findAll({
      include: [
        {
          model: UserCredential,
          include:[
            {model:Course}
          ]
        },
        {
          model:BsfStudentChart
        }
      ],
      where:{
        '$UserCredential.Course.acronym$':'BSF',
        '$BsfStudentChart.id$':{ [Op.is]: null },
        role:'Student'
      },
      attributes:{exclude:['password']}
    })

    res.status(200).json({users:users})
  } catch (error) {
    console.log(error)
  }
}


exports.getStudentOrg = async (req,res)=>{
    try {
        const orgDetails = await BsfStudentChart.findAll({
            include: [
              {
                model: User,
                attributes:{exclude:['password']}
              },
            ],
            order: [['createdAt', 'DESC']]
          })

          const formattedData = orgDetails.map((data)=>{
            let fullName = `${data?.User?.firstName} ${data?.User?.middleName ? data?.User?.middleName[0] : ''} ${data?.User.lastName} ${data?.User?.suffix ?  data?.User?.suffix : ''}`
            return {role:data?.role,extension:data?.extension,id:data?.id,fullName:fullName}
          })


          return res.status(200).json({
            data:formattedData
          })
    } catch (error) {
        
    }
}


exports.deleteStudentOrgMember = async (req,res)=>{
    try {
      const {userId} = req.params


      const isExist = await BsfStudentChart.findOne({
        where:{
          id:userId
        }
      })

      if(!isExist) return res.status(404).json({message:'Faculty Member not Found!'})

      await isExist.destroy()

      return res.status(204).json({
        message:'Successfully deleted'
      })


    } catch (error) {
      console.log(error)
    }
  }


  exports.getBsfChart = async (req,res)=>{
    try {
      const bsfMemebers = await BsfStudentChart.findAll({
        include:{
          model:User,
          attributes:{exclude:['password']}
        }
      })
      
      const layers=[
        ['Tagapayo'],
        ['Pangulo'],
        ['Pangalawang Pangulo','Kalihim','Ingat-yaman','Tagasuri'],
        ['Business Chairperson','Tagapamalita','Lakambini','Lakandiwa'],
        ['Kinatawan ng 1st Year','Kinatawan ng 2nd Year','Kinatawan ng 3rd Year','Kinatawan ng 4th Year'],
        ['Kawaksing Kalihim']
      ]

  
      const info = []
      layers.map((layerArr)=>{
        const innerLayer = []
        layerArr.map((layer)=>{
          for (let k = 0; k < bsfMemebers.length; k++) {
            const member = bsfMemebers[k];
            if (layer === member?.role) {
                const formatted = dataFormatted(member);
                innerLayer.push(formatted);
                // Remove processed member from bsfMemebers
                bsfMemebers.splice(k, 1);
                k--; // Decrement k to account for removed element
            }
          }
        })
        if(innerLayer?.length!=0){
          info.push(innerLayer)
        }
      })
      


      res.status(200).json({members:info})
    } catch (error) {
      console.log(error)
    }
  }


  const dataFormatted = (data)=>{
    const defaultImage = '/assets/images/ddl-logo.png'
    let name = `${data?.User?.firstName} ${ data?.User?.middleName ? data?.User?.middleName[0] : ''} ${data?.User?.lastName} ${data?.extension ? ", " + data?.extension : ''}`
    let image = data?.User?.image ? data?.User?.image : defaultImage
    let description = data?.description ? data?.description : null
    return {gender:'female',description:description,name:name,id:data?.id,image:image,role:data?.role}
  }