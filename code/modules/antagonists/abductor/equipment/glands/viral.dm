/obj/item/organ/heart/gland/viral
	abductor_hint = "contamination incubator. The abductee becomes a carrier of a random advanced disease - of which they are unaffected by."
	cooldown_low = 1800
	cooldown_high = 2400
	uses = 1
	icon_state = "viral"
	mind_control_uses = 1
	mind_control_duration = 1800

/obj/item/organ/heart/gland/viral/activate()
	to_chat(owner, span_warning("You feel sick."))
	var/datum/pathogen/advance/A = random_virus(pick(2,6),6)
	A.affected_mob_is_only_carrier = TRUE
	owner.try_contract_pathogen(A, FALSE, TRUE)

/obj/item/organ/heart/gland/viral/proc/random_virus(max_symptoms, max_level)
	if(max_symptoms > VIRUS_SYMPTOM_LIMIT)
		max_symptoms = VIRUS_SYMPTOM_LIMIT
	var/datum/pathogen/advance/A = new /datum/pathogen/advance()
	var/list/datum/symptom/possible_symptoms = list()
	for(var/symptom in subtypesof(/datum/symptom))
		var/datum/symptom/S = symptom
		if(initial(S.level) > max_level)
			continue
		if(initial(S.level) <= 0) //unobtainable symptoms
			continue
		possible_symptoms += S
	for(var/i in 1 to max_symptoms)
		var/datum/symptom/chosen_symptom = pick_n_take(possible_symptoms)
		if(chosen_symptom)
			var/datum/symptom/S = new chosen_symptom
			A.symptoms += S
	A.update_properties() //just in case someone already made and named the same disease
	return A
