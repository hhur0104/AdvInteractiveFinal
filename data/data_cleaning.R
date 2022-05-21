setwd("~/Dropbox (Dropbox @RU)/InteractiveVis/Adv.course/final/data/")

library("rjson")
world <- fromJSON(file="world-110m.geo.json")

json.names <- vector()
json.econ <- vector()
json.income <- vector()

for (c in world$features) {
  json.names <- append(json.names, c$properties$admin)
  json.econ <- append(json.econ, c$properties$economy)
  json.income <- append(json.income, c$properties$income_grp)
}


pergdp <- read.csv(file="pergdp.csv")
# matching countries
table(pergdp$Country %in% json.names)
# non-matching countries
pergdp$Country[!pergdp$Country %in% json.names] # names to be changed
json.names[!json.names %in% pergdp$Country] # use this name

pergdp[,c(2:74)] <- pergdp[,c(2:74)]*100
rownames(pergdp) <- pergdp$Country
write.csv(pergdp, "pergdp_eur_actual.csv")

library(dplyr)
summary(pergdp[,c(2:74)])
count(pergdp[,c(2:74)])
##############################################################
################ EUROPE ######################################
##############################################################
europe <- c("Albania","Bosnia and Herzegovina",
            "Bulgaria","Croatia",
            "Czech Republic","Estonia",
            "Hungary","Kosovo",
            "Latvia","Lithuania",
            "North Macedonia",
            "Montenegro","Poland",
            "Romania","Serbia",
            "Slovakia","Slovenia",
            "Yugoslavia","Armenia",
            "Azerbaijan","Belarus",
            "Georgia","Moldova",
            "Russia","Ukraine",
            "Austria","Belgium",
            "Cyprus","Denmark",
            "Finland","France",
            "Germany","Greece",
            "Iceland","Ireland",
            "Italy","Luxembourg",
            "Malta","Netherlands",
            "Norway","Portugal",
            "Spain","Sweden",
            "Switzerland","United Kingdom")

table(pergdp$Country %in% europe)
summary(pergdp[europe,c(2:74)])

dim(pergdp[europe,c(2:74)])

table(pergdp[europe,c(45:74)] > 10)
table(pergdp[europe,c(42:74)] > 9)
table(pergdp[europe,c(42:74)] > 8)
table(pergdp[europe,c(42:74)] > 7)
table(pergdp[europe,c(42:74)] > 6)
table(pergdp[europe,c(42:74)] > 5)
table(pergdp[europe,c(42:74)] > 4)


pergdp_europe <- pergdp[,c(2:74)]
pergdp_europe[pergdp_europe > 4] <- 5
pergdp_europe[pergdp_europe > 3 & pergdp_europe <= 4] <- 4
pergdp_europe[pergdp_europe > 2 & pergdp_europe <= 3] <- 3
pergdp_europe[pergdp_europe > 1 & pergdp_europe <= 2] <- 2
pergdp_europe[pergdp_europe <= 1] <- 1
pergdp_europe$'Country' <- rownames(pergdp_europe)
write.csv(pergdp_europe, file="pergdp_eur_cat.csv")

View(pergdp_europe[europe,c(72,73,74)])


############################################################
################ ASIA ######################################
############################################################
asia <- c("Australia", "Fiji",
          "New Zealand","Papua New Guinea",
          "Afghanistan","Bangladesh",
          "India","Nepal",
          "Pakistan","Sri Lanka",
          
          "China","Japan",
          "Korea, North",
          "Korea, South",
          "Mongolia","Taiwan",
          
          "Brunei","Cambodia",
          "Indonesia","Laos",
          "Malaysia","Myanmar",
          "Philippines","Singapore",
          "Thailand","Timor Leste",
          "Viet Nam","Kazakhstan",
          "Kyrgyz Republic","Tajikistan",
          "Turkmenistan","Uzbekistan")
table(pergdp$Country %in% asia)
summary(pergdp[asia,c(2:74)])

table(pergdp[asia,c(53:74)] > 10)
table(pergdp[asia,c(53:74)] > 9)
table(pergdp[asia,c(53:74)] > 8)
table(pergdp[asia,c(53:74)] > 7)
table(pergdp[asia,c(53:74)] > 6)
table(pergdp[asia,c(53:74)] > 5)
table(pergdp[asia,c(53:74)] > 4)
table(pergdp[asia,c(53:74)] > 3)
table(pergdp[asia,c(53:74)] > 2)
table(pergdp[asia,c(53:74)] > 1)
table(pergdp[asia,c(53:74)] < 1)

pergdp_asia <- pergdp[,c(2:74)]
pergdp_asia[pergdp_asia > 4] <- 5
pergdp_asia[pergdp_asia > 3 & pergdp_asia <= 4] <- 4
pergdp_asia[pergdp_asia > 2 & pergdp_asia <= 3] <- 3
pergdp_asia[pergdp_asia > 1 & pergdp_asia <= 2] <- 2
pergdp_asia[pergdp_asia <= 1] <- 1
pergdp_asia$'Country' <- rownames(pergdp_asia)
write.csv(pergdp_asia, file="pergdp_asia_cat.csv")


###################################################################
################ Middle East ######################################
###################################################################
asia <- c("Bahrain",
          "Egypt",
          "Iran",
          "Iraq",
          "Israel",
          "Jordan",
          "Kuwait",
          "Lebanon",
          "Oman",
          "Qatar",
          "Saudi Arabia",
          "Syria",
          "Turkey",
          "United Arab Emirates",
          "Yemen, North",
          "Yemen")
table(pergdp$Country %in% asia)
summary(pergdp[asia,c(2:74)])

table(pergdp[asia,c(53:74)] > 10)
table(pergdp[asia,c(53:74)] > 9)
table(pergdp[asia,c(53:74)] > 8)
table(pergdp[asia,c(53:74)] > 7)
table(pergdp[asia,c(53:74)] > 6)
table(pergdp[asia,c(53:74)] > 5)
table(pergdp[asia,c(53:74)] > 4)
table(pergdp[asia,c(53:74)] > 3)
table(pergdp[asia,c(53:74)] > 2)
table(pergdp[asia,c(53:74)] > 1)
table(pergdp[asia,c(53:74)] < 1)

pergdp_asia <- pergdp[,c(2:74)]
pergdp_asia[pergdp_asia > 7] <- "F5"
pergdp_asia[pergdp_asia > 5 & pergdp_asia <= 7] <- "F4"
pergdp_asia[pergdp_asia > 3 & pergdp_asia <= 5] <- "F3"
pergdp_asia[pergdp_asia > 1 & pergdp_asia <= 3] <- "F2"
pergdp_asia[pergdp_asia <= 1] <- "F1"
pergdp_asia$'Country' <- rownames(pergdp_asia)

pergdp_asia[pergdp_asia =="F5"] <- 5
pergdp_asia[pergdp_asia =="F4"] <- 4
pergdp_asia[pergdp_asia =="F3"] <- 3
pergdp_asia[pergdp_asia =="F2"] <- 2
pergdp_asia[pergdp_asia =="F1"] <- 1
write.csv(pergdp_asia, file="pergdp_asia2_cat.csv")
