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
      let format =null
      const coor = await BsfStudentChart.findAll({
        include:{
          model:User,
          attributes:{exclude:['password']}
        },
        where:{
          role:'Tagapayo'
        }
      })

  
      const info = []
      if(coor.length > 1){
        let count = 0
        coor.map((data,index)=>{
          let format = {}
          let pids  = null
          if(count < coor.length-1){
            format= dataFormatted(data)
            pids = coor[index+1].id
          }else{
            format = dataFormatted(data)
            pids = coor[0].id
          }
          info.push({...format,pids:[pids]})
          count++
        })
      }

      const pangulo = await BsfStudentChart.findOne({
        include:{
          model:User,
          attributes:{exclude:['password']}
        },
        where:{
          role:'Pangulo'
        }
      })

      if(pangulo) format = dataFormatted(pangulo)
      if(coor.length > 1 && pangulo){
        info.push({...format,mid:[coor[0].id],fid:[coor[1].id]})
      }else if(coor.length == 1){
        info.push({...format,mid:[coor[0].id]})
      }

      const pangalawangLayer = await BsfStudentChart.findAll({
        include:{
          model:User,
          attributes:{exclude:['password']}
        },
        where:{
          role:{
            [Op.in]:['Pangalawang Pangulo','Kalihim','Ingat-yaman','Tagasuri']
          }
        }
      })


      if(pangulo.length!=0){
        pangalawangLayer.map((data)=>{
          format = dataFormatted(data)
          info.push({...format,mid:pangulo?.id})
        })
      }

      const pangatlongLayer = await BsfStudentChart.findAll({
        include:{
          model:User,
          attributes:{exclude:['password']}
        },
        where:{
          role:{
            [Op.in]:['Business Chairperson','Tagapamalita','Lakambini','Lakandiwa']
          }
        }
      })

      if(pangalawangLayer.length!=0){
        pangatlongLayer.map((data,index)=>{
          format = dataFormatted(data)
          let assignedIndex = index == pangalawangLayer.length-1 ? pangalawangLayer.length-1 : index
          info.push({...format,mid:pangalawangLayer[assignedIndex]?.id})
        })
      }

      const pangataptLayer = await BsfStudentChart.findAll({
        include:{
          model:User,
          attributes:{exclude:['password']}
        },
        where:{
          role:{
            [Op.in]:['Kinatawan ng 1st Year','Kinatawan ng 2nd Year','Kinatawan ng 3rd Year','Kinatawan ng 4th Year']
          }
        }
      })

      if(pangatlongLayer.length!=0){
        pangataptLayer.map((data,index)=>{
          format = dataFormatted(data)
          let assignedIndex = index == pangatlongLayer.length-1 ? pangatlongLayer.length-1 : index
          info.push({...format,mid:pangatlongLayer[assignedIndex]?.id})
        })
      }

      const huliLayer = await BsfStudentChart.findOne({
        include:{
          model:User,
          attributes:{exclude:['password']}
        },
        where:{
          role:'Kawaksing Kalihim'
        }
      })

      if(huliLayer && pangataptLayer){
        format = dataFormatted(huliLayer)
        info.push({...format,mid:pangataptLayer[0]?.id})
      }


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