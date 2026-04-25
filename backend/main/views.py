import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt


QUESTIONS = [
    {
        "id": 1,
        "a": "짜장면",
        "b": "짬뽕",
    },
    {
        "id": 2,
        "a": "C",
        "b": "Python",
    },
    {
        "id": 3,
        "a": "부먹",
        "b": "찍먹",
    },
    {
        "id": 4,
        "a": "아메리카노",
        "b": "라떼",
    },
    {
        "id": 5,
        "a": "민초",
        "b": "반민초",
    },
    {
        "id": 6,
        "a": "전화",
        "b": "카톡",
    },
    {
        "id": 7,
        "a": "여름",
        "b": "겨울",
    },
    {
        "id": 8,
        "a": "산",
        "b": "바다",
    },
    {
        "id": 9,
        "a": "치킨",
        "b": "피자",
    },
    {
        "id": 10,
        "a": "쉬는날 집에만 있기",
        "b": "쉬는날 밖에 나가기",
    },
]


def questions_api(request):
    if request.method != "GET":
        return JsonResponse(
            {"error": "GET 요청만 가능합니다."},
            status=405
        )

    return JsonResponse(QUESTIONS, safe=False)


@csrf_exempt
def result_api(request):
    if request.method != "POST":
        return JsonResponse(
            {"error": "POST 요청만 가능합니다."},
            status=405
        )

    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse(
            {"error": "잘못된 JSON 형식입니다."},
            status=400
        )

    member_answers = data.get("memberAnswers")

    if not isinstance(member_answers, dict):
        return JsonResponse(
            {"error": "memberAnswers는 객체 형태여야 합니다."},
            status=400
        )

    if len(member_answers) < 2:
        return JsonResponse(
            {"error": "비교하려면 최소 2명 이상의 답변이 필요합니다."},
            status=400
        )

    for member_name, answers in member_answers.items():
        if not isinstance(answers, list):
            return JsonResponse(
                {"error": f"{member_name}의 답변은 리스트여야 합니다."},
                status=400
            )

        if len(answers) != len(QUESTIONS):
            return JsonResponse(
                {"error": f"{member_name}의 답변 개수가 질문 개수와 일치하지 않습니다."},
                status=400
            )

    results = []

    for target_name, target_answers in member_answers.items():
        similar_people = []
        different_people = []
        neutral_people = []

        for other_name, other_answers in member_answers.items():
            if target_name == other_name:
                continue

            match_count = 0

            for target_answer, other_answer in zip(target_answers, other_answers):
                if target_answer == other_answer:
                    match_count += 1

            if match_count >= 5:
                similar_people.append({
                    "name": other_name,
                    "matchCount": match_count,
                })
            elif match_count <= 3:
                different_people.append({
                    "name": other_name,
                    "matchCount": match_count,
                })
            else:
                neutral_people.append({
                    "name": other_name,
                    "matchCount": match_count,
                })

        results.append({
            "member": target_name,
            "similarPeople": similar_people,
            "differentPeople": different_people,
            "neutralPeople": neutral_people,
        })

    return JsonResponse({
        "results": results,
        "totalCount": len(QUESTIONS),
    })