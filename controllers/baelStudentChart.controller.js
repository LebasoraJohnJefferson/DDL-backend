const {
    Faculty, Course, User, UserCredential,BaelStudentChart
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


        const isRegisted = await BaelStudentChart.findOne({
          include:[
            {model:User}
          ],
          where:{
            '$User.id$':userId
          }
        })

        if(isRegisted) return res.status(409).json({message:"User already registered"})

        await BaelStudentChart.create(req.body)
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
          model:BaelStudentChart
        }
      ],
      where:{
        '$UserCredential.Course.acronym$':'BAEL',
        '$BaelStudentChart.id$':{ [Op.is]: null },
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
        const orgDetails = await BaelStudentChart.findAll({
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


      const isExist = await BaelStudentChart.findOne({
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


exports.getBaelChart = async (req,res)=>{
  try {
    const baelMembers = await BaelStudentChart.findAll({
      include:{
        model:User,
        attributes:{exclude:['password']}
      }
    })

    layers = [
      ['ELSoc Adviser'],
      ['President'],
      ['Vice President'],
      ['Secretary','Assistant Secretary'],
      ['Treasurer','Assistant Treasurer'],
      ['Auditor','Public Information Officer (PIO)','Head Business & Project Committee'],
      ['1st Year Representative','2nd Year Representative','3rd Year Representative','4th Year Representative']
    ]


    

    const info =[]
    layers.map((layerArr)=>{
      const innerLayer = []
      layerArr.map((layer)=>{
        for (let k = 0; k < baelMembers.length; k++) {
          const member = baelMembers[k];
          if (layer === member?.role) {
              const formatted = dataFormatted(member);
              innerLayer.push(formatted);
              // Remove processed member from baelMembers
              baelMembers.splice(k, 1);
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
  return {gender:'male',description:description,name:name,id:data?.id,image:image,role:data?.role}
}