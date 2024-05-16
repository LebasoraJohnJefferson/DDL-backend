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

    const coor = await BaelStudentChart.findAll({
      include:{
        model:User,
        attributes:{exclude:['password']}
      },
      where:{
        role:'ELSoc Adviser'
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

    const president = await BaelStudentChart.findOne({
      include:{
        model:User,
        attributes:{exclude:['password']}
      },
      where:{
        role:'President'
      }
    })

    let formattedPresident =null
    if(president) formattedPresident = dataFormatted(president)
    if(coor.length > 1){
      info.push({...formattedPresident,mid:[coor[0].id],fid:[coor[1].id]})
    }else if(coor.length == 1){
      info.push({...formattedPresident,mid:[coor[0].id]})
    }

    const vicePresident = await BaelStudentChart.findOne({
      include:{
        model:User,
        attributes:{exclude:['password']}
      },
      where:{
        role:'Vice President'
      }
    })
    let formattedVicePresident = null
    if(vicePresident) formattedVicePresident = dataFormatted(vicePresident)
    if(formattedPresident.length!=0){
      info.push({...formattedVicePresident,mid:formattedPresident?.id})
    }

    const anySecretary = await BaelStudentChart.findAll({
      include:{
        model:User,
        attributes:{exclude:['password']}
      },
      where:{
        role:{
          [Op.in]:['Secretary','Assistant Secretary']
        }
      }
    })

    if(vicePresident){
      anySecretary.map((data)=>{
        let formattedAnySecretary = dataFormatted(data)
        info.push({...formattedAnySecretary,mid:vicePresident?.id})
      })
    }

    const Treasurer = await BaelStudentChart.findAll({
      include:{
        model:User,
        attributes:{exclude:['password']}
      },
      where:{
        role:{
          [Op.in]:['Treasurer','Assistant Treasurer']
        }
      }
    })

    if(anySecretary.length != 0){
      Treasurer.map((data,index)=>{
        let pids = null
        let formattedAnyTreasurer = dataFormatted(data)
        let mid = index > anySecretary.length ? anySecretary[0]?.id : anySecretary[index]?.id 
        if(anySecretary.length == 1) pids = anySecretary[0]?.id;
        info.push({...formattedAnyTreasurer,mid:mid,pids:[pids]})
      })
    }

    const APBcategory = await BaelStudentChart.findAll({
      include:{
        model:User,
        attributes:{exclude:['password']}
      },
      where:{
        role:{
          [Op.in]:['Head Business & Project Committee','Auditor','Public Information Officer (PIO)']
        }
      }
    })

    if(Treasurer.length != 0){
      APBcategory.map((data,index)=>{
        let formattedAPBcategory = dataFormatted(data)
        let mid = null
        let fid = null
        if(index == 0 || index+1 == APBcategory.length){
            mid = index == 0 ? Treasurer[0]?.id : Treasurer[Treasurer.length-1]?.id
        }else{
            mid = Treasurer.length == 1 ? Treasurer[index]?.id : Treasurer[0]?.id
        }
        info.push({...formattedAPBcategory,mid:mid,fid:fid})
      })
    }


    const representative = await BaelStudentChart.findAll({
      include:{
        model:User,
        attributes:{exclude:['password']}
      },
      where:{
        role:{
          [Op.in]:[
            '1st Year Representative',
            '2nd Year Representative',
            '3rd Year Representative',
            '4th Year Representative',
          ]
        }
      }
    })

    if(APBcategory){
        let temp = 0
      representative.map((data,index)=>{
        let mid = null
        let formattedRepresentative = dataFormatted(data)
        if(index == 0 || index == APBcategory.length-1){
          mid = index == 0 ? APBcategory[0]?.id : APBcategory[APBcategory.length-1]?.id;
        }else{
          if(APBcategory.length == 2){
            mid = APBcategory[1]?.id
          }else{
            if(APBcategory.length>2){
              if(APBcategory[index]) temp = index
              mid = APBcategory[temp]?.id
            }else{
              mid = APBcategory[0]?.id
            }
          }
         
        }
        info.push({...formattedRepresentative,mid:mid})
      })
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
  return {gender:'male',description:description,name:name,id:data?.id,image:image,role:data?.role}
}