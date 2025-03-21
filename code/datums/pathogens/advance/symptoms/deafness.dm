/**Deafness
 * Slightly decreases stealth
 * Lowers Resistance
 * Slightly decreases stage speed
 * Decreases transmissibility
 * Intense level
 * Bonus: Causes intermittent loss of hearing.
*/
/datum/symptom/deafness
	name = "Deafness"
	desc = "The virus causes inflammation of the eardrums, causing intermittent deafness."
	stealth = -1
	resistance = -2
	stage_speed = -1
	transmittable = -3
	level = 4
	severity = 4
	base_message_chance = 100
	symptom_delay_min = 25
	symptom_delay_max = 80
	threshold_descs = list(
		"Resistance 9" = "Causes permanent deafness, instead of intermittent.",
		"Stealth 4" = "The symptom remains hidden until active.",
	)

/datum/symptom/deafness/sync_properties(list/properties)
	. = ..()
	if(!.)
		return
	if(properties[PATHOGEN_PROP_STEALTH] >= 4)
		suppress_warning = TRUE
	if(properties[PATHOGEN_PROP_RESISTANCE] >= 9) //permanent deafness
		power = 2

/datum/symptom/deafness/on_process(datum/pathogen/advance/A)
	. = ..()
	if(!.)
		return
	var/mob/living/carbon/M = A.affected_mob
	var/obj/item/organ/ears/ears = M.getorganslot(ORGAN_SLOT_EARS)
	if(!ears)
		return //cutting off your ears to cure the deafness: the ultimate own
	switch(A.stage)
		if(3, 4)
			if(prob(base_message_chance) && !suppress_warning)
				to_chat(M, span_warning("[pick("You hear a ringing in your ear.", "Your ears pop.")]"))
		if(5)
			if(power >= 2)
				if(ears.damage < ears.maxHealth)
					to_chat(M, span_userdanger("Your ears pop painfully and start bleeding!"))
					// Just absolutely murder me man
					ears.applyOrganDamage(ears.maxHealth)
					M.emote("agony")
			else
				to_chat(M, span_userdanger("Your ears pop and begin ringing loudly!"))
				ears.deaf = min(20, ears.deaf + 15)
