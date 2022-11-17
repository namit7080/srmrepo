var async = require("async");
const Researchinfo = require("../model/Reserachinfo");
const Interest = require("../model/Interest");
const Paper = require("../model/Researchpaper");
const Table = require("../model/table");
const UserID = require("../model/userid");


const Singup = require("../model/singup");
const SerpApi = require("google-search-results-nodejs");
const router = require("../router");
var url = 0;

var firstname="";
var secondname="";
var departmentname="";
var scholarurlname="";
var srmidname="";
var emailname="";
var passwordname="";
var post="";

const search = new SerpApi.GoogleSearch(
  "ab1e180ec0a12feafffa41b431c3088ef3e771dc5bb2febbd3070aa1a287df78"
);

// const params = {
//   engine: "google_scholar_author",
//   author_id: url,
//   num: "100",
// };

const callback = async function (data) {
  try {
    const obj = data["cited_by"];
    const author = data["author"];
    const name = author.name;
    const affiliation = author.affiliations;
    const picurl = author.thumbnail;
    const intrest = author.interests;
    const coauthor = data["co_authors"];
    const paper = data["articles"];
    const tables = data["cited_by"];
    const citationscount = tables.table[0].citations.all;
    const h_index = tables.table[1].h_index.all;
    const i10_index = tables.table[2].i10_index.all;
    const graph = tables.graph;
   // console.log(scholarurlname+" yy");
     
   departmentname=departmentname.trim();
   departmentname=departmentname.toUpperCase();
   post=post.trim();
   post=post.toUpperCase();

    const singupaccount= await Singup.create({
      first:firstname,
      lastname:secondname,
      department:departmentname,
      scholarurl:scholarurlname,
      email:emailname,
      password:passwordname,
    
    });
    

      // ,async function (singerr, singup) {
        console.log(singupaccount);
      await Researchinfo.create(
        {
          name: name,
          affliation: affiliation,
          profilepic: picurl,
          department:departmentname,
          post:post
        },
        async function (err, profile) {
          if (err) {
            console.log(err);
          } else {
            async.each(intrest, function (inte) {
              const inter = inte.title;
              let int = inter.toUpperCase();
              profile.interest.push(int);

              Interest.findOne({ tittle: int }, async function (erri, getit) {
                if (!getit) {
                  Interest.create(
                    {
                      tittle: int,
                    },
                    async function (err3, interestcreat) {
                      await interestcreat.user.push(profile);
                      await interestcreat.save();
                    }
                  );
                } else {
                  await getit.user.push(profile);
                  await getit.save();
                }
              });
            });
            // profile.save();
          }

          const promises = await paper.map(function (paper) {
            Paper.create(
              {
                tittle: paper.title,
                link: paper.link,
                author: paper.authors,
                publication: paper.publication,
                publishyear: paper.year,
                cited: paper.cited_by.value,
              },
              async function (err, paperc) {
                if (err) {
                  console.log(err + " eror");
                } else {
                  paperc.user = profile;
                  paperc.save();
                  profile.papers.push(paperc);
                }
              }
            );
          });
          await Promise.all(promises);

          Table.create(
            {
              citations: citationscount,
              h_index: h_index,
              i10_index: i10_index,
            },
            function (errtable, graphtable) {
              if (errtable) {
              } else {
                for (let i = 0; i < graph.length; i++) {
                  graphtable.graph.push(graph[i]);
                }

                graphtable.author = profile;

                profile.table = graphtable;
                async.each(coauthor, function (data) {
                  profile.coauthor.push(data);
                });
              }
              graphtable.save();
             
              singupaccount.info=profile;
              profile.singup=singupaccount;
              profile.save();
              singupaccount.save();
              //  singup.info=profile;
              //  singup.save();
            }
          );
        }
      );
      
    // });
   
  } catch (e) {}
};

// Show result as JSON

module.exports.save = async function (req, res) {
  try{

  const str = req.body.url;
  var start = 0;
  var end = 0;
  var a = 0;

  let index = str.indexOf("user=");
  start = index + 5;
  end = start;
  while (end != str.length && str.charAt(end) !== "&") {
    end = end + 1;
  }
  //end=end-1;
  console.log(start + " " + end);
  url = str.slice(start, end);
  console.log(url);

  const params = {
    engine: "google_scholar_author",
    author_id: url,
    num: "100",
  };

  // if(!req.body.firstname||req.body.lastname||req.body.department||req.body.scholarurl||req.body.smrid||req.body.email||req.body.password||req.body.otp){
  //   return res.json(400, {
  //     message: "Invalid",
  //   });
  // }
  

  let first = req.body.firstname;
  let second = req.body.lastname;
  let department = req.body.department;
  let scholarurl = req.body.scholarurl;
  let srmid = req.body.smrid;
  let email = req.body.email;
  let password = req.body.password;
  let postrank = req.body.post;
 
  if (
    !first ||
    !second ||
    !department ||
    !scholarurl ||
    !srmid ||
    !email ||
    !password ||
    !postrank
  ) {
    return res.json(400, {
      message: "Incomplete Information",
    });
  }
  
  let present = await Singup.findOne({ email: email });
  if (present) {
    return res.json(200, {
      message: "Login Please",
    });
  }
  firstname = first;
  secondname = second;
  departmentname = department;
  scholarurlname = scholarurl;
  srmidname = srmidname;
  emailname = email;
  passwordname = password;
  post=postrank;
  console.log(scholarurlname);

  UserID.create({ id: url }, function (err, userid) {});
 search.json(params, callback);
  return res.json(200, {
    message: "Success",
  });
  }
  catch(e){
    return res.json(200, {
      message: "Invalid",
    });
  }
};
