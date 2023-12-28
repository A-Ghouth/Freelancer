import json
import pandas as pd
import openpyxl
# Functions ------------------------------------------------------------
# --> Sync Files
def read_file(file_name):
    with open(file_name) as f:
        return json.load(f)


def write_file(file_name, data):
    for key, value in data.items():
        data[key] = sorted(value)
    with open(file_name, "w") as f:
        json.dump(data, f)


# --> Helpful Functions
def printDict(data):
    for key, value in data.items():
        data[key] = sorted(value)
    for key, value in data.items():
        print(key, ":", value)


def shiftList(data):
    return data[1:] + data[:1]


def resetValues():
    global totlaParticipents, today_chapters
    today_chapters = list(range(startChapter, startChapter + 10))
    totlaParticipents = len(persons)

def readCSV(fileName):
    workbook = openpyxl.load_workbook(f"{fileName}.xlsx")
    sheet = workbook.active

    itr = -1
    for row in sheet.iter_rows():
        itr += 1
        persons[keys[itr]] = []
        
        for i in range(1,len(row)):
            if row[i].value == None:
                break
            persons[keys[itr]].append(row[i].value)
# --> Undirect Functions 
def testChapter(key, value, chapters):
    for chpt in chapters:
        if chpt not in value:
            today_chapters.remove(chpt)

            global totlaParticipents
            totlaParticipents -= 1
            return

def testKeys(keys):
    resetValues()

    for key in keys:
        value = persons[key]
        testChapter(key, value, today_chapters)

        if key == "anas":
            testChapter(key, value, today_chapters)

            global totlaParticipents
            totlaParticipents += 1

# --> vip Functions

def getKeys(keys):
    best = 100
    bestKey = keys
    for iteration in range(len(persons)):
        testKeys(keys)

        if totlaParticipents == 0:
            return keys
        
        if totlaParticipents < best:
            best = totlaParticipents
            bestKey = keys

        keys = shiftList(keys)
    return bestKey

def updateData(keys, chapters):
    
    for key in keys:
        value = persons[key]
        
        if key == "عم أنس":
            for chpt in chapters :
                
                if chpt > 60:
                    today_chapters.remove(chpt)
                    break 

                if chpt not in value:
                    today_chapters.remove(chpt)
                    value.append(chpt)
                    print(f"{chpt} <-- {key.ljust(8)}")   
                    break 

        for chpt in chapters:
                
                if chpt > 60:
                    today_chapters.remove(chpt)
                    break 

                if chpt not in value:
                    
                    today_chapters.remove(chpt)
                    value.append(chpt)
                    print(f"{chpt} <-- {key.ljust(8)}")   
                    break  
        
# Varibles ------------------------------------------------------------
persons = read_file("data.txt")
startChapter = 1
keys = list(persons.keys())

today_chapters = list(range(startChapter, startChapter + 10))
totlaParticipents = len(persons)

DayNames = ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"]
day = 21
thisDay = 4

# Main ----------------------------------------------------------------

while startChapter <= 60:
    
    keys = getKeys(keys)
    print()
    print(f'جدول التهجد ليلة {DayNames[thisDay]} {day} رمضان ')
    print("--> *الأحزاب* :\n")
    day += 1
    thisDay += 1
    if thisDay == 7:
        thisDay = 0

    resetValues()
    (updateData(keys, today_chapters))
    startChapter += 9
  
    today_chapters = list(range(startChapter, startChapter + 9))

# keys = getKeys(keys)
# print("--------------------")
# resetValues()
# (updateData(keys, today_chapters))

#write_file("data.txt", persons)

